import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { validate as validateDto } from 'class-validator';

import { AiChatSession } from './entities/ai-chat-session.entity';
import { AiMessage } from './entities/ai-message.entity';
import { ChatMessageDto } from './dto/chat-message.dto';
import { AiResponseDto } from './dto/ai-response.dto';
import { IAiService } from './interfaces/ai-service.interface';
import { Account } from 'src/account/account.entity';
import { Game } from 'src/game/game.entity';
import { OrderService } from '../order/order.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { Order } from '../order/order.entity';
import { AccountService } from '../account/account.service';
import { plainToInstance } from 'class-transformer';
import { RedisService } from 'src/shared/redis/redis.service';
@Injectable()
export class AiService implements IAiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private readonly SYSTEM_PROMPT = `You are a PlayStation game account assistant.
   You help users buy game accounts by analyzing their requirements and suggesting the best matching accounts.

  Your mission is make order. by function i give you.
  you speak on language which user ask you.
 
IMPORTANT: All prices are in USD (US Dollars). Always mention currency when talking about prices.
  TO AKE ORDER U NEED NEXT DATA:
  
  - purchaseType required
  - platform required
  - phone required
  - accountId required
  - customerName optional
  - email optional
  - telegram optional
  - notes optional


## INPUT FORMAT:
You receive JSON with context and user message:
{
  "context": {
    "currentOrder": {
      "game": 
      "purchaseType":  
      "platform": 
      "phone": 
    },
    "availableAccounts": [
      {
        "accountId": ,
        "games": 
        "platformPS4": 
        "platformPS5": 
        "priceP1": 
        "P1": 
        "P2PS4": 
        "P2PS5": 
      }
    ]
  },
  "userMessage": ""
}

## NEW APPROACH - AI DECISION MAKING:

1. **COLLECT USER REQUIREMENTS** - Ask for: game, purchaseType, platform
2. **GET ACCOUNTS DATA** - Call getAllAccounts() to load all accounts into context
3. **ANALYZE AVAILABLE ACCOUNTS** - Use availableAccounts from context to find best matches
4. **SUGGEST BEST OPTIONS** - Present user-friendly suggestions based on requirements
5. **CREATE ORDER** - When user confirms an account, call createOrder()

## IMPORTANT:
- After calling getAllAccounts(), the availableAccounts array will be in your context
- Analyze availableAccounts to find accounts matching user's game, platform, and purchaseType
- Present suggestions in a user-friendly way, not as raw JSON
- After updating data with updateOrderData(), continue the conversation flow automatically
- Don't wait for user input after calling updateOrderData() - ask the next question immediately
- ALWAYS provide a response after calling updateOrderData() - never leave the user hanging

## CONVERSATION FLOW:

**Step 1:** Ask "What game would you like to buy?"
**Step 2:** When user provides game name, call updateOrderData({ game: "game_name" }) then ask "What purchase type do you want? CRITICAL: Show options in user's language (Ukrainian: Офлайн активація, Онлайн активація, На прокат | Russian: Офлайн активация, Онлайн активация, На прокат | English: Offline activation, Online activation, For rent) but always save the exact English value when calling updateOrderData()"**Step 3:** When user provides purchase type, call updateOrderData({purchaseType: "purchaseType_name"}) then ask "What platform? (PS4 or PS5)"
**Step 4:** When user provides platform, call updateOrderData({ platform: "platform_name" }) then call getAllAccounts() to get all accounts with games
**Step 5:** Analyze availableAccounts and suggest best matching accounts based on user requirements
**Step 6:** When user chooses an account, call updateOrderData({ accountId: account_id }) then ask for phone number
**Step 7:** When user provides phone, call updateOrderData({ phone: "phone_number" }) then call createOrder() with all collected data

## AVAILABLE FUNCTIONS:
- getAllAccounts() → get all accounts with games (no filters needed)
- updateOrderData({ game?, purchaseType?, platform?, phone?, accountId?, customerName?, email?, telegram?, notes? }) → save user requirements
- createOrder() → create final order

## LANGUAGE INSTRUCTIONS:
- Always speak in the user's language (Ukrainian/Russian/English)
- Always look which language user speak and speak in this language
- For purchase types, show translated options but save English values:
  - Ukrainian: "Офлайн активація, Онлайн активація, На прокат"
  - Russian: "Офлайн активация, Онлайн активация, На прокат" 
  - English: "Offline activation, Online activation, For rent"
- When calling updateOrderData(), always use exact English values: "offline activation", "online activation", "for rent"




⚠️ CRITICAL: Use your intelligence to analyze accounts and suggest the best matches based on user requirements!`;
  constructor(
    @InjectRepository(AiChatSession)
    private chatSessionRepository: Repository<AiChatSession>,
    @InjectRepository(AiMessage)
    private messageRepository: Repository<AiMessage>,
    private configService: ConfigService,
    private redisService: RedisService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private orderService: OrderService,
    private accountService: AccountService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    this.logger.log('AiService constructor started');

    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.logger.log(`OpenAI API Key exists: ${!!apiKey}`);

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.logger.log('OpenAI client initialized successfully');
    } else {
      this.logger.warn('OpenAI API Key not found, using mock responses');
    }

    this.logger.log('AiService initialized successfully');
  }

  async createSession(
    userId?: string,
    userName?: string,
    language: string = 'uk',
  ): Promise<AiChatSession> {
    const sessionId = uuidv4();

    const session = this.chatSessionRepository.create({
      sessionId,
      userId,
      userName,
      language,
      isActive: true,
      context: {},
    });

    const savedSession = await this.chatSessionRepository.save(session);
    this.logger.log(`Created new AI session: ${sessionId}`);

    return savedSession;
  }

  async getSession(sessionId: string): Promise<AiChatSession | null> {
    this.logger.log(`Searching for session with ID: ${sessionId}`);

    const session = await this.chatSessionRepository.findOne({
      where: { sessionId },
    });

    this.logger.log(
      `Session search result: ${session ? 'FOUND' : 'NOT FOUND'}`,
    );
    if (session) {
      this.logger.log(`Found session: ${session.sessionId}, ID: ${session.id}`);
    }

    return session;
  }

  async updateSessionContext(
    sessionId: string,
    context: Record<string, any>,
  ): Promise<void> {
    await this.chatSessionRepository.update({ sessionId }, { context });
  }

  async processMessage(chatMessageDto: ChatMessageDto): Promise<AiResponseDto> {
    let session = await this.getSession(chatMessageDto.sessionId);
    if (!session) {
      this.logger.log(
        `🆕 Creating new session for: ${chatMessageDto.sessionId}`,
      );
      session = await this.createSession(
        chatMessageDto.userId,
        chatMessageDto.userName,
        'uk',
      );
    }

    // Save user message
    await this.redisService.addMessageToCache(session.sessionId, {
      message: chatMessageDto.message,
      isFromUser: true,
      messageType: 'text',
      timestamp: new Date(),
    });
    this.logger.log(`�� Saved user message to Redis`);

    // Generate AI response
    const aiResponse = await this.generateResponse(
      chatMessageDto.message,
      session,
    );

    // Если AI не вернул ответ, возвращаем пустое сообщение
    if (aiResponse === null || aiResponse === '') {
      return {
        message: '',
        type: 'response',
        sessionId: session.sessionId,
        timestamp: new Date(),
      };
    }

    // Save AI response
    await this.redisService.addMessageToCache(session.sessionId, {
      message: aiResponse,
      isFromUser: false,
      messageType: 'text',
      timestamp: new Date(),
    });
    this.logger.log(`💾 Saved AI response to Redis`);

    return {
      message: aiResponse,
      type: 'response',
      sessionId: session.sessionId,
      timestamp: new Date(),
    };
  }

  async generateResponse(
    message: string,
    session: AiChatSession,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.log('🔧 No OpenAI API key - using mock response');
      return 'Hello! I am your AI assistant for PS-Play. I can help you choose gaming accounts for PlayStation. (Mock response)';
    }

    try {
      this.logger.log(`🤖 Generating response for message: "${message}"`);

      // Всегда отправляем только currentOrder - AI может получить аккаунты через функцию
      const contextData = {
        context: {
          currentOrder: session.context || {},
        },
        userMessage: message,
      };

      this.logger.log(`📤 Sending currentOrder context`);

      this.logger.log(
        `📋 Context data: ${JSON.stringify(contextData, null, 2)}`,
      );

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(contextData) },
      ];

      this.logger.log(`📤 Sending ${messages.length} messages to AI`);

      // Helper to execute tool calls and return structured JSON
      const runTool = async (
        fnName: string,
        fnArgsJson: string,
      ): Promise<Record<string, any>> => {
        this.logger.log(`🔧 AI called function: ${fnName}`);
        try {
          if (fnName === 'createOrder') {
            const args = JSON.parse(fnArgsJson) as CreateOrderDto;

            const dto = plainToInstance(CreateOrderDto, args);
            const errors = await validateDto(dto);
            if (errors.length > 0) {
              this.logger.warn(
                `⚠️ Validation failed: ${JSON.stringify(errors.map((e) => e.property))}`,
              );
              return { ok: false, error: 'Validation failed for order data' };
            }

            const order = await this.orderService.createOrder(dto);
            return { ok: true, orderId: order.id };
          }

          if (fnName === 'getAllAccounts') {
            const _args = JSON.parse(fnArgsJson) as {
              gameFilter?: string;
              platformFilter?: 'PS4' | 'PS5';
            };
            this.logger.log(
              `🔍 Getting accounts with filters: ${JSON.stringify(_args)}`,
            );

            const accounts = await this.accountService.findAll();

            const updatedContext = {
              ...session.context,
              availableAccounts: accounts,
            };
            await this.updateSessionContext(session.sessionId, updatedContext);

            return { ok: true, accounts: accounts };
          }

          if (fnName === 'updateOrderData') {
            const args = JSON.parse(fnArgsJson) as Record<string, any>;
            this.logger.log(`📝 Updating order data: ${JSON.stringify(args)}`);

            const updatedContext = { ...session.context, ...args };
            await this.updateSessionContext(session.sessionId, updatedContext);

            return { ok: true, context: updatedContext };
          }
        } catch (e) {
          this.logger.error(`❌ Error executing tool ${fnName}:`, e);
          return { ok: false, error: 'Tool execution error' };
        }

        this.logger.warn(`⚠️ Unknown tool requested: ${fnName}`);
        return { ok: false, error: 'Unknown tool' };
      };

      // Execute function-calling loop until we get a final assistant message
      let loopGuard = 0;
      while (loopGuard < 5) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: messages,
          max_tokens: 1000,
          tools: [
            {
              type: 'function',
              function: {
                name: 'createOrder',
                description: 'Create a new order',
                parameters: {
                  type: 'object',
                  properties: {
                    customerName: { type: 'string' },
                    accountId: { type: 'number' },
                    phone: { type: 'string' },
                    platform: { type: 'string' },
                    notes: { type: 'string' },
                    email: { type: 'string' },
                    telegram: { type: 'string' },
                    purchaseType: { type: 'string' },
                  },
                  required: ['accountId', 'phone', 'platform', 'purchaseType'],
                },
              },
            },
            {
              type: 'function',
              function: {
                name: 'getAllAccounts',
                description:
                  'Get all available gaming accounts with their details',
                parameters: {
                  type: 'object',
                  properties: {
                    gameFilter: {
                      type: 'string',
                      description:
                        'Optional game name to filter accounts (e.g., "FIFA 25")',
                    },
                    platformFilter: {
                      type: 'string',
                      enum: ['PS4', 'PS5'],
                      description: 'Optional platform filter',
                    },
                  },
                  required: [],
                },
              },
            },
            {
              type: 'function',
              function: {
                name: 'updateOrderData',
                description: 'Update order data in the current session context',
                parameters: {
                  type: 'object',
                  properties: {
                    game: { type: 'string' },
                    accountId: { type: 'number' },
                    purchaseType: {
                      type: 'string',
                    },
                    platform: { type: 'string', enum: ['PS4', 'PS5'] },
                    phone: { type: 'string' },
                    customerName: { type: 'string' },
                    email: { type: 'string' },
                    telegram: { type: 'string' },
                    notes: { type: 'string' },
                  },
                  required: [],
                },
              },
            },
          ],
        });

        const aiMessage = response.choices[0]?.message;
        if (!aiMessage) {
          break;
        }

        // Add assistant message with tool calls (if any) to the conversation
        messages.push(
          aiMessage as OpenAI.Chat.Completions.ChatCompletionMessageParam,
        );

        const toolCalls = aiMessage.tool_calls;
        if (!toolCalls || toolCalls.length === 0) {
          const finalContent =
            aiMessage.content || 'Sorry, I could not generate a response.';
          this.logger.log(`🤖 AI response: "${finalContent}"`);
          return finalContent;
        }

        // Execute tool calls sequentially and append their results
        for (const toolCall of toolCalls) {
          if (toolCall.type !== 'function') {
            continue;
          }
          const result = await runTool(
            toolCall.function.name,
            toolCall.function.arguments,
          );
          this.logger.log(
            `🔧 Tool result for ${toolCall.function.name}: ${JSON.stringify(result).slice(0, 500)}`,
          );

          const toolMessage = {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          } as OpenAI.Chat.Completions.ChatCompletionMessageParam;
          messages.push(toolMessage);
        }

        loopGuard += 1;
      }

      this.logger.warn('⚠️ Exceeded tool-calling loop limit.');
      return 'Sorry, I could not complete the request.';
    } catch (error: any) {
      this.logger.error('❌ Error generating AI response:', error);
      return "⚠️ I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }

  async getMessageHistory(
    sessionId: string,
    limit: number = 50,
  ): Promise<AiMessage[]> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return [];
    }

    return await this.messageRepository.find({
      where: { sessionId: session.id },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    try {
      this.logger.log(`Creating order for account ${orderData.accountId}`);
      const order = await this.orderService.createOrder(orderData);
      this.logger.log(`Order created successfully: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw error;
    }
  }
}
