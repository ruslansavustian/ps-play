import { AiChatSession } from '../entities/ai-chat-session.entity';
import { AiMessage } from '../entities/ai-message.entity';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { AiResponseDto } from '../dto/ai-response.dto';
export interface IUserContext {
  userId?: string;
  userName?: string;
  language: string;
  platformPreference?: string;
  budgetRange?: number;
  gamePreferences?: number[];
  previousInteractions?: string[];
}

export interface IRecommendationContext {
  availableAccounts: any[];
  userPreferences: IUserContext;
  budget: number;
  platform: string;
  gameIds: number[];
}

export interface IAiService {
  createSession(
    userId?: string,
    userName?: string,
    language?: string,
  ): Promise<AiChatSession>;
  getSession(sessionId: string): Promise<AiChatSession | null>;
  updateSessionContext(
    sessionId: string,
    context: Record<string, any>,
  ): Promise<void>;

  processMessage(chatMessageDto: ChatMessageDto): Promise<AiResponseDto>;
  generateResponse(message: string, session: AiChatSession): Promise<string>;

  getMessageHistory(sessionId: string, limit?: number): Promise<AiMessage[]>;

  validateUserInput(message: string): boolean;
  sanitizeInput(message: string): string;
  filterResponse(response: string): string;
}
