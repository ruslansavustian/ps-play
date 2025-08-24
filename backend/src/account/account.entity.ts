import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../game/game.entity';

@Entity('accounts')
export class Account {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Game associated with this account',
    type: () => Game,
  })
  @ManyToOne(() => Game, { eager: true })
  @JoinColumn({ name: 'gameId' })
  games: Game;

  @ApiProperty({
    description: 'Gaming platform',
    type: String,
  })
  @Column({ length: 100 })
  platform: string;

  @ApiProperty({ description: 'Price for PS platform', type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePS: number;

  @ApiProperty({ description: 'Price for PS4 platform', type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePS4: number;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  created: Date;
}
