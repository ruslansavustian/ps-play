import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

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

@Injectable()
export class AiService implements IAiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private readonly SYSTEM_PROMPT = `You are a PS-Play assistant. You help customers buy PlayStation accounts.

## CONVERSATION FLOW

1. GAME SELECTION (Optional - only if customer asks about games)
- If the customer mentions a game → check available games.  
- If the game exists → show all accounts that contain this game.  
- If no accounts exist → suggest browsing all available games.  

2. ACCOUNT SELECTION  
- When the customer chooses an account ID → confirm their choice.  

3. PURCHASE DETAILS  
- Ask for purchase type. Allowed values: P1, P2PS4, P2PS5, P3, P3A.  
- Then ask for platform (PS4 or PS5).  
- Then ask for their phone number.  

4. ORDER CREATION  
- ✅ Only when you have **all 4 required fields** → {accountId, purchaseType, platform, phone} → call the {create_order} function.  
- ❌ Never call {create_order} if even one field is missing.  
- ❌ Never guess or invent values. Always explicitly ask the customer for missing details.  

---
## IMPORTANT RULES:
- Game selection is only for discovering accounts.
- Once an account ID has been provided by the user:
  - Do NOT ask about games again.
  - Do NOT suggest other accounts unless explicitly asked.
  - Move directly to collecting purchase details: purchaseType, platform, phone.
- Only call {create_order} when all 4 required fields are collected: accountId, purchaseType, platform, phone.
- Be efficient - don't ask for the same information twice.
- Track what information you already have from the session context.

## PURCHASE TYPES
- P1 = Offline activation
- P2PS4 = Online activation for PS4
- P2PS5 = Online activation for PS5
- P3 = Without activation
- P3A = For rent

⚠️ CRITICAL ORDER RULE
You must not call {create_order} until you have confirmed ALL required fields: accountId, purchaseType, platform, phone.`;
  constructor(
    @InjectRepository(AiChatSession)
    private chatSessionRepository: Repository<AiChatSession>,
    @InjectRepository(AiMessage)
    private messageRepository: Repository<AiMessage>,
    private configService: ConfigService,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private orderService: OrderService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    // Добавим логирование для отладки
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
    // Validate input data
    if (!this.validateUserInput(chatMessageDto.message)) {
      throw new BadRequestException('Invalid message content');
    }

    const sanitizedMessage = this.sanitizeInput(chatMessageDto.message);

    // Get or create session
    let session = await this.getSession(chatMessageDto.sessionId);

    // Добавим логирование для отладки
    this.logger.log(`Looking for session: ${chatMessageDto.sessionId}`);
    this.logger.log(`Session found: ${!!session}`);

    if (!session) {
      this.logger.log(
        `Session not found, creating new one for: ${chatMessageDto.sessionId}`,
      );
      session = await this.createSession(
        chatMessageDto.userId,
        chatMessageDto.userName,
        'uk',
      );
    } else {
      this.logger.log(`Using existing session: ${session.sessionId}`);
    }

    // Save user message to database
    const userMessage = this.messageRepository.create({
      sessionId: session.id,
      message: sanitizedMessage,
      isFromUser: true,
      messageType: 'text',
    });
    await this.messageRepository.save(userMessage);

    // Extract order information from user message and update session context
    this.logger.log(
      `Processing message: "${sanitizedMessage}" for session: ${session.sessionId}`,
    );
    this.logger.log(
      `Current context before update: ${JSON.stringify(session.context)}`,
    );
    await this.updateSessionWithOrderInfo(sanitizedMessage, session);

    // Refresh session to get updated context
    const updatedSession = await this.getSession(session.sessionId);
    if (!updatedSession) {
      throw new Error('Session not found after context update');
    }

    // Generate AI response
    const aiResponse = await this.generateResponse(
      sanitizedMessage,
      updatedSession,
    );

    // Save AI response to database
    const aiMessage = this.messageRepository.create({
      sessionId: session.id,
      message: aiResponse,
      isFromUser: false,
      messageType: 'text',
    });
    await this.messageRepository.save(aiMessage);

    return {
      message: aiResponse,
      type: 'response',
      sessionId: updatedSession.sessionId,
      timestamp: new Date(),
    };
  }
  private getMissingOrderFields(context: any): string[] {
    const required = ['accountId', 'purchaseType', 'platform', 'phone'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return required.filter((field) => !context[field]);
  }

  private async updateSessionWithOrderInfo(
    message: string,
    session: AiChatSession,
  ): Promise<void> {
    const context = { ...(session.context || {}) };
    const lowerMessage = message.toLowerCase().trim();
    let hasUpdates = false;

    // Extract account ID (numbers)
    const accountIdMatch = message.match(/\b(\d+)\b/);
    if (accountIdMatch && !context.accountId) {
      context.accountId = parseInt(accountIdMatch[1]);
      hasUpdates = true;
    }

    // Extract purchase type - handle "p1 and ps4" type messages
    const purchaseTypeMatch = lowerMessage.match(/\b(p1|p2ps4|p2ps5|p3|p3a)\b/);
    if (purchaseTypeMatch && !context.purchaseType) {
      context.purchaseType = purchaseTypeMatch[1].toUpperCase();
      hasUpdates = true;
    }

    // Extract platform - handle "ps 4", "ps 5", "ps4", "ps5"
    const platformMatch = lowerMessage.match(/\b(ps\s*[45]|ps4|ps5)\b/);
    if (platformMatch && !context.platform) {
      const platform = platformMatch[1].replace(/\s+/, '').toUpperCase();
      context.platform = platform;
      hasUpdates = true;
    }

    // Extract phone number (Ukrainian phone patterns)
    const phoneMatch = message.match(/\b(0\d{9})\b/);
    if (phoneMatch && !context.phone) {
      context.phone = phoneMatch[1];
      hasUpdates = true;
    }

    // Update session context if any changes were made
    if (hasUpdates) {
      await this.updateSessionContext(session.sessionId, context);
      this.logger.log(`Updated session context: ${JSON.stringify(context)}`);
    }
  }
  async generateResponse(
    message: string,
    session: AiChatSession,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.log('Using mock response (no OpenAI API key)');
      return 'Hello! I am your AI assistant for PS-Play. I can help you choose gaming accounts for PlayStation. (Mock response)';
    }

    try {
      const context = await this.buildContext(session);

      let retries = 3;
      let lastError: any;

      while (retries > 0) {
        try {
          const messageHistory = await this.getMessageHistory(
            session.sessionId,
            10,
          );
          const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
            [
              { role: 'system', content: this.SYSTEM_PROMPT },
              { role: 'system', content: context },
            ];
          messageHistory.forEach((msg) => {
            messages.push({
              role: msg.isFromUser ? 'user' : 'assistant',
              content: msg.message,
            });
          });
          messages.push({ role: 'user', content: message });
          const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.6,
            frequency_penalty: 0.6,
            tools: [
              {
                type: 'function',
                function: {
                  name: 'create_order',
                  description: 'Create a new order for a gaming account',
                  parameters: {
                    type: 'object',
                    properties: {
                      accountId: { type: 'number' },
                      purchaseType: {
                        type: 'string',
                        enum: ['P1', 'P2PS4', 'P2PS5', 'P3', 'P3A'],
                      },
                      platform: { type: 'string', enum: ['PS4', 'PS5'] },
                      phone: { type: 'string' },
                      customerName: { type: 'string' },
                      email: { type: 'string' },
                      telegram: { type: 'string' },
                    },
                    required: [
                      'accountId',
                      'purchaseType',
                      'platform',
                      'phone',
                    ],
                  },
                },
              },
            ],
            tool_choice: 'auto',
          });

          const choice = response.choices[0];
          const msg = choice.message;

          this.logger.log(
            `AI response type: ${msg?.tool_calls?.length ? 'tool_calls' : 'text'}`,
          );

          // 👉 Обработка вызова функций
          if (msg?.tool_calls?.length) {
            const toolCall = msg.tool_calls[0];
            if (toolCall.type === 'function') {
              const functionName = toolCall.function.name;

              let functionArgs: CreateOrderDto;
              try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                functionArgs = JSON.parse(toolCall.function.arguments);
              } catch (err) {
                this.logger.error('Failed to parse function arguments:', err);
                return 'Sorry, I could not process your order details. Please try again.';
              }

              this.logger.log(
                `AI wants to call function: ${functionName}, args: ${JSON.stringify(functionArgs)}`,
              );

              if (functionName === 'create_order') {
                // Простая валидация - доверяем AI
                if (
                  !functionArgs.accountId ||
                  !functionArgs.phone ||
                  !functionArgs.platform ||
                  !functionArgs.purchaseType
                ) {
                  const missing = [];
                  if (!functionArgs.accountId) missing.push('account ID');
                  if (!functionArgs.phone) missing.push('phone number');
                  if (!functionArgs.platform)
                    missing.push('platform (PS4/PS5)');
                  if (!functionArgs.purchaseType)
                    missing.push('purchase type (P1, P2PS4, P2PS5, P3, P3A)');

                  return `⚠️ I cannot create order without: ${missing.join(', ')}. Please provide all required information first.`;
                }

                // Дополнительная проверка purchaseType
                const validPurchaseTypes = [
                  'P1',
                  'P2PS4',
                  'P2PS5',
                  'P3',
                  'P3A',
                ];
                if (!validPurchaseTypes.includes(functionArgs.purchaseType)) {
                  return `⚠️ Invalid purchase type. Please choose one of: P1, P2PS4, P2PS5, P3, P3A`;
                }

                // Создаем заказ
                try {
                  const order = await this.createOrder(functionArgs);
                  return `✅ Order created successfully! Order ID: ${order.id}. Thank you for your purchase! We will contact you soon to complete the transaction.`;
                } catch (error) {
                  this.logger.error('Error creating order:', error);
                  return `❌ Sorry, there was an error creating your order. Please try again or contact support.`;
                }
              }
            }
          }

          // 👉 Обычный текстовый ответ
          const aiResponse =
            msg?.content || 'Sorry, I could not generate a response.';
          this.logger.log(`AI text response: ${aiResponse}`);
          return this.filterResponse(aiResponse);
        } catch (err: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          lastError = err;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (err.status === 429) {
            retries--;
            if (retries > 0) {
              const waitTime = Math.pow(2, 3 - retries) * 1000;
              this.logger.warn(`Rate limit hit, retrying in ${waitTime}ms...`);
              await new Promise((resolve) => setTimeout(resolve, waitTime));
              continue;
            }
          }
          throw err;
        }
      }

      throw lastError;
    } catch (error: any) {
      this.logger.error('Error generating AI response:', error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'insufficient_quota' || error.status === 429) {
        return "⚠️ I'm experiencing high demand. Please try again later or contact support.";
      }

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

  validateUserInput(message: string): boolean {
    // Базовые проверки
    if (!message || message.trim().length === 0) {
      return false;
    }

    // Проверка на слишком длинные сообщения (спам)
    if (message.length > 1000) {
      return false;
    }

    // Проверка на запрещенные символы/слова
    const forbiddenPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];

    const hasForbiddenContent = forbiddenPatterns.some((pattern) =>
      pattern.test(message),
    );

    if (hasForbiddenContent) {
      return false;
    }

    // Принимаем все валидные сообщения
    return true;
  }

  sanitizeInput(message: string): string {
    return message
      .replace(/\/system|\/admin|\/root/gi, '')
      .replace(/<script|javascript:|eval\(/gi, '')
      .trim();
  }

  filterResponse(response: string): string {
    if (!response) {
      return "⚠️ Sorry, I couldn't generate a response. Try again?";
    }

    // Просто возвращаем ответ без фильтрации
    return response;
  }

  private async buildContext(session: AiChatSession): Promise<string> {
    try {
      // Get all accounts
      const accounts = await this.accountRepository.find({
        where: { isDeleted: false },
      });

      // Get all games
      const games = await this.gameRepository.find({
        where: { isDeleted: false },
        select: ['id', 'name'],
      });

      // Logging for debugging
      this.logger.log(
        `Found ${accounts.length} accounts and ${games.length} games`,
      );
      this.logger.log(
        `Games: ${games.map((g) => `${g.id}:${g.name}`).join(', ')}`,
      );

      // Session state - get collected order information
      const context = session.context || {};
      const accountId = (context.accountId as number) || 'none';
      const purchaseType = (context.purchaseType as string) || 'none';
      const platform = (context.platform as string) || 'none';
      const phone = (context.phone as string) || 'none';

      // Prepare accounts JSON (optional: you can filter by selected game if needed)
      const accountsList = JSON.stringify(accounts, null, 2);

      // Build context string
      return `CURRENT ORDER INFORMATION:
- Account ID: ${accountId}
- Purchase Type: ${purchaseType}
- Platform: ${platform}
- Phone: ${phone}

MISSING INFORMATION: ${this.getMissingOrderFields(context).join(', ') || 'None - ready to create order'}

User language: ${session.language}

AVAILABLE GAMES: ${games.map((g) => g.name).join(', ')}

AVAILABLE ACCOUNTS:
${accountsList}

IMPORTANT RULES:
- Game selection is only for discovering accounts.
- Once an account ID has been provided and confirmed (${accountId !== 'none' ? 'ALREADY CHOSEN' : 'NOT CHOSEN'}):
  - Do NOT ask about games again.
  - Move directly to collecting purchase details: purchaseType, platform, phone.
- Only call {create_order} when all 4 required fields are collected: accountId, purchaseType, platform, phone.
- Be efficient - don't ask for information you already have.
- If all required fields are present, call {create_order} immediately.

Guidance for AI:
- When user asks about a specific game, show matching accounts if no account is already selected.
- If an account is already selected, do NOT show games again.
- Be friendly and guide the user step by step.
- Use the collected information to avoid asking for the same details twice.`;
    } catch (error) {
      this.logger.error('Error building context:', error);
      return `User session state: none
User language: ${session.language}
Platform preference: ${session.platformPreference || 'any'}
Budget: ${session.budgetRange || 'any'}`;
    }
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
