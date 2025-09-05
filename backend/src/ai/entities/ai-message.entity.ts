import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AiChatSession } from './ai-chat-session.entity';

@Entity('ai_messages')
export class AiMessage {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Session ID' })
  @Column({ type: 'int' })
  sessionId: number;

  @ApiProperty({ description: 'Message content' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'Is message from user' })
  @Column({ type: 'boolean' })
  isFromUser: boolean;

  @ApiProperty({ description: 'Message type' })
  @Column({ type: 'varchar', length: 50, default: 'text' })
  messageType: string;

  @ApiProperty({ description: 'Message metadata (JSON object)' })
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AiChatSession, (session) => session.messages)
  @JoinColumn({ name: 'sessionId' })
  session: AiChatSession;
}
