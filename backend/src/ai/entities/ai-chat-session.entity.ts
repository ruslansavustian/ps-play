import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AiMessage } from './ai-message.entity';

@Entity('ai_chat_sessions')
export class AiChatSession {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Session identifier' })
  @Column({ type: 'varchar', length: 255, unique: true })
  sessionId: string;

  @ApiProperty({ description: 'User identifier (optional)' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userId?: string;

  @ApiProperty({ description: 'User name' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  userName?: string;

  @ApiProperty({ description: 'User language preference' })
  @Column({ type: 'varchar', length: 10, default: 'uk' })
  language: string;

  @ApiProperty({ description: 'User platform preference (PS4/PS5)' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  platformPreference?: string;

  @ApiProperty({ description: 'User budget range' })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budgetRange?: number;

  @ApiProperty({ description: 'User game preferences (JSON array)' })
  @Column({ type: 'json', nullable: true })
  gamePreferences?: number[];

  @ApiProperty({ description: 'Session context (JSON object)' })
  @Column({ type: 'json', nullable: true })
  context?: Record<string, any>;

  @ApiProperty({ description: 'Is session active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AiMessage, (message) => message.session)
  messages: AiMessage[];
}
