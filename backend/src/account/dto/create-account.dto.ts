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
    description: 'Price for P1',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  priceP1?: number;

  @ApiProperty({
    description: 'Price for P2PS4',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  priceP2PS4?: number;

  @ApiProperty({
    description: 'Price for P2PS5',
    example: 39.99,
    required: false,
  })
  @IsNumber()
  priceP2PS5?: number;

  @ApiProperty({
    description: 'Price for P3',
    example: 39.99,
    required: false,
  })
  @IsNumber()
  priceP3?: number;

  @ApiProperty({
    description: 'P1 status',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P1?: boolean;

  @ApiProperty({
    description: 'P2 status for PS4',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P2PS4?: boolean;

  @ApiProperty({
    description: 'P2 status for PS5',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P2PS5?: boolean;

  @ApiProperty({
    description: 'P3 status',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  P3?: boolean;
}
