import { ApiProperty } from '@nestjs/swagger';

export class AiResponseDto {
  @ApiProperty({
    description: 'AI response message',
    example: 'Привет! Я помогу выбрать игровой аккаунт для PlayStation.',
  })
  message: string;

  @ApiProperty({ description: 'Response type', example: 'greeting' })
  type: string;

  @ApiProperty({ description: 'Session ID', example: 'session_123' })
  sessionId: string;

  @ApiProperty({ description: 'Response metadata', required: false })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Timestamp', example: '2024-01-15T10:30:00Z' })
  timestamp: Date;
}
