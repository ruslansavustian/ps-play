import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('chat_messages')
export class ChatMessage {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Message content' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'User name' })
  @Column({ type: 'varchar', length: 100 })
  userName: string;

  @ApiProperty({ description: 'User ID', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  userId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;
}
