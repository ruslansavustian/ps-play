import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Game ID for this account',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  games: number;

  @ApiProperty({
    description: 'PS4',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  platformPS4: boolean;

  @ApiProperty({
    description: 'PS5',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  platformPS5: boolean;

  @ApiProperty({
    description: 'Price for PS platform',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  pricePS5: number;

  @ApiProperty({
    description: 'Price for PS4 platform',
    example: 39.99,
  })
  @IsNumber()
  @IsNotEmpty()
  pricePS4: number;

  @ApiProperty({
    description: 'P1 status',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P1?: boolean;

  @ApiProperty({
    description: 'P2 status',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P2?: boolean;

  @ApiProperty({
    description: 'P3 status',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P3?: boolean;
}
