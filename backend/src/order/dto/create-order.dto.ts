import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    type: String,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Phone number',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Game name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  gameName: string;

  @ApiProperty({
    description: 'Platform',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'Notes',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Customer email',
    type: String,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Customer telegram',
    type: String,
  })
  @IsOptional()
  @IsString()
  telegram?: string;
}
