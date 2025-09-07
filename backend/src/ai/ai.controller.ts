import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { AiResponseDto } from './dto/ai-response.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { AiChatSession } from './entities/ai-chat-session.entity';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { AiMessage } from './entities/ai-message.entity';
import { Public } from 'src/auth/public.decorator';

@ApiTags('AI Chat')
@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('session')
  @Public()
  @ApiOperation({ summary: 'Create new AI chat session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<AiChatSession> {
    try {
      this.logger.log(
        `Creating new AI session for user: ${createSessionDto.userId || 'anonymous'}`,
      );

      const session = await this.aiService.createSession(
        createSessionDto.userId,
        createSessionDto.userName,
        createSessionDto.language || 'uk',
      );

      this.logger.log(`AI session created: ${session.sessionId}`);
      return session;
    } catch (error) {
      this.logger.error('Error creating AI session:', error);
      throw new HttpException(
        'Failed to create session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/:sessionId')
  @Public()
  @ApiOperation({ summary: 'Get AI chat session by ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(
    @Param('sessionId') sessionId: string,
  ): Promise<AiChatSession> {
    try {
      const session = await this.aiService.getSession(sessionId);

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      return session;
    } catch (error) {
      this.logger.error(`Error getting session ${sessionId}:`, error);
      throw new HttpException(
        'Failed to get session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('message')
  @Public()
  @ApiOperation({ summary: 'Send message to AI and get response' })
  @ApiResponse({ status: 200, description: 'Message processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendMessage(
    @Body() chatMessageDto: ChatMessageDto,
  ): Promise<AiResponseDto> {
    try {
      const response = await this.aiService.processMessage(chatMessageDto);
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/:sessionId/messages')
  @Public()
  @ApiOperation({ summary: 'Get message history for session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of messages to retrieve',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getMessageHistory(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit?: number,
  ): Promise<AiMessage[]> {
    try {
      const messages = await this.aiService.getMessageHistory(
        sessionId,
        limit || 50,
      );
      return messages;
    } catch (error) {
      this.logger.error(
        `Error getting message history for session ${sessionId}:`,
        error,
      );
      throw new HttpException(
        'Failed to get message history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('session/:sessionId/context')
  @Public()
  @ApiOperation({ summary: 'Update session context' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Context updated successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async updateSessionContext(
    @Param('sessionId') sessionId: string,
    @Body() contextData: { context: Record<string, any> },
  ): Promise<{ message: string }> {
    try {
      await this.aiService.updateSessionContext(sessionId, contextData.context);

      this.logger.log(`Context updated for session: ${sessionId}`);
      return { message: 'Context updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating context for session ${sessionId}:`,
        error,
      );
      throw new HttpException(
        'Failed to update context',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Check AI service health' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck(): Promise<{ status: string; timestamp: Date }> {
    return Promise.resolve({
      status: 'healthy',
      timestamp: new Date(),
    });
  }

  @Post('order')
  @Public()
  @ApiOperation({ summary: 'Create order through AI' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    this.logger.log(`Creating order for account ${createOrderDto.accountId}`);
    return await this.aiService.createOrder(createOrderDto);
  }
}
