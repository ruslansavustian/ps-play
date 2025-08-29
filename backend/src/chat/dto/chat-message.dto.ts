import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'User name', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'User ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}
