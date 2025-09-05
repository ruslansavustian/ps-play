import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Привет! Помоги выбрать аккаунт для PS5',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Session ID', example: 'session_123' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'User ID (optional)',
    example: 'user_456',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'User name (optional)',
    example: 'Иван',
    required: false,
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'Is message from user', example: true })
  @IsBoolean()
  isFromUser: boolean;

  @ApiProperty({ description: 'Message metadata (optional)', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
