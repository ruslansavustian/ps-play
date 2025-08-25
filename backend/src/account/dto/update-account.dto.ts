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

  @ApiProperty({
    description: 'Price for PS5 platform',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pricePS5?: number;

  @ApiProperty({
    description: 'Price for PS4 platform',
    example: 39.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pricePS4?: number;

  @ApiProperty({
    description: 'P1 status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P1?: boolean;

  @ApiProperty({
    description: 'P2 status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P2?: boolean;

  @ApiProperty({
    description: 'P3 status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  P3?: boolean;
}
