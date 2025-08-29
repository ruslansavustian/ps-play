import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinChatDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: 'User ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}
