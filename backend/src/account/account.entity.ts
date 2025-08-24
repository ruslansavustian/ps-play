import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum GamePlatform {
  PLAYSTATION = 'playstation',
  XBOX = 'xbox',
  STEAM = 'steam',
  EPIC_GAMES = 'epic_games',
  NINTENDO = 'nintendo',
  BATTLE_NET = 'battle_net',
  ORIGIN = 'origin',
  UBISOFT = 'ubisoft',
}

export enum AccountStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  PENDING = 'pending',
}

@Entity('accounts')
export class Account {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Gaming platform', enum: GamePlatform })
  @Column({
    type: 'enum',
    enum: GamePlatform,
  })
  platform: GamePlatform;

  @ApiProperty({
    description: 'Account username or email',
    type: String,
    maxLength: 100,
  })
  @Column({ length: 100 })
  username: string;

  @ApiProperty({
    description: 'Account level or rank',
    type: String,
    maxLength: 50,
  })
  @Column({ length: 50, nullable: true })
  level: string;

  @ApiProperty({ description: 'Games owned or achievements', type: String })
  @Column({ type: 'text', nullable: true })
  gamesLibrary: string;

  @ApiProperty({ description: 'Account price in USD', type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Account status', enum: AccountStatus })
  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.AVAILABLE,
  })
  status: AccountStatus;

  @ApiProperty({ description: 'Additional account description', type: String })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Account verification status', type: Boolean })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Region or server', type: String, maxLength: 50 })
  @Column({ length: 50, nullable: true })
  region: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
