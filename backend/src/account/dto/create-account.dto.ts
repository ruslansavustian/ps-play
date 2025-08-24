import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { GamePlatform, AccountStatus } from '../account.entity';

export class CreateAccountDto {
  @ApiProperty({ description: 'Gaming platform', enum: GamePlatform })
  @IsNotEmpty()
  @IsEnum(GamePlatform)
  platform: GamePlatform;

  @ApiProperty({ description: 'Account username or email', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty({
    description: 'Account level or rank',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string;

  @ApiProperty({ description: 'Games owned or achievements', required: false })
  @IsOptional()
  @IsString()
  gamesLibrary?: string;

  @ApiProperty({ description: 'Account price in USD' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Account status',
    enum: AccountStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({
    description: 'Additional account description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Account verification status', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    description: 'Region or server',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;
}
