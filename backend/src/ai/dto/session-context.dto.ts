import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';

export class SessionContextDto {
  @ApiProperty({ description: 'Session ID', example: 'session_123' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'User language preference', example: 'uk' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ description: 'Platform preference', example: 'PS5' })
  @IsString()
  @IsOptional()
  platformPreference?: string;

  @ApiProperty({ description: 'Budget range', example: 1000 })
  @IsNumber()
  @IsOptional()
  budgetRange?: number;

  @ApiProperty({
    description: 'Game preferences (array of game IDs)',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  gamePreferences?: number[];

  @ApiProperty({ description: 'Additional context', required: false })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}
