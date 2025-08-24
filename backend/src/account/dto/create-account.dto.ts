import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Game ID for this account',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  games: number;

  @ApiProperty({
    description: 'Gaming platform',
    example: 'PlayStation',
  })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({
    description: 'Price for PS platform',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  pricePS: number;

  @ApiProperty({
    description: 'Price for PS4 platform',
    example: 39.99,
  })
  @IsNumber()
  @IsNotEmpty()
  pricePS4: number;
}
