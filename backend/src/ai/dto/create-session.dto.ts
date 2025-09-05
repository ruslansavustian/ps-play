import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSessionDto {
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

  @ApiProperty({ description: 'User language preference', example: 'uk' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ description: 'Is session active', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
