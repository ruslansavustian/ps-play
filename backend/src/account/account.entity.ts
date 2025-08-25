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

  //PS4 PLATFORM
  @ApiProperty({
    description: 'PS4',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  platformPS4: boolean;

  //PS5 PLATFORM

  @ApiProperty({
    description: 'PS5',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  platformPS5: boolean;

  @ApiProperty({ description: 'Price for PS5 platform', type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePS5: number;

  @ApiProperty({ description: 'Price for PS4 platform', type: Number })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePS4: number;

  //P1 STATUS
  @ApiProperty({
    description: 'P1 status',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P1: boolean;

  //P2 STATUS
  @ApiProperty({
    description: 'P2 status',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P2: boolean;

  //P3 STATUS
  @ApiProperty({
    description: 'Account activation status',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P3: boolean;

  //CREATION DATE
  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  created: Date;
}
