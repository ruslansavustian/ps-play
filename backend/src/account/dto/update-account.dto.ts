import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Game ID for this account',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  games?: number;

  @ApiProperty({
    description: 'PS4',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  platformPS4?: boolean;

  @ApiProperty({
    description: 'PS5',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  platformPS5?: boolean;

  //PRICE FOR P1
  @ApiProperty({
    description: 'Price for P1',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  priceP1?: number;

  //PRICE FOR P2PS4
  @ApiProperty({
    description: 'Price for P2PS4',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  priceP2PS4?: number;

  //PRICE FOR P2PS5
  @ApiProperty({
    description: 'Price for P2PS5',
    example: 39.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  priceP2PS5?: number;

  //PRICE FOR P3
  @ApiProperty({
    description: 'Price for P3',
    example: 39.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  priceP3?: number;

  //P1 STATUS
  @ApiProperty({
    description: 'P1 status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P1?: boolean;

  @ApiProperty({
    description: 'P2 status for PS4',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P2PS4?: boolean;

  @ApiProperty({
    description: 'P2 status for PS5',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P2PS5?: boolean;

  @ApiProperty({
    description: 'P3 status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P3?: boolean;
}
