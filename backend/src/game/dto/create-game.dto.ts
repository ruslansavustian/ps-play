import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'Game name',
    example: 'FIFA 24',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Game photo URL',
    example: 'https://s3.amazonaws.com/bucket/photos/game.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
