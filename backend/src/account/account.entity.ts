import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../game/game.entity';
import { Order } from '../order/order.entity';

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
    description: 'Orders associated with this account',
    type: () => [Order],
  })
  @OneToMany(() => Order, (order) => order.account)
  orders: Order[];

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

  //PRICE FOR P1
  @ApiProperty({ description: 'Price for P1', type: Number })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  priceP1: number;

  //PRICE FOR P2PS4
  @ApiProperty({ description: 'Price for P2PS4', type: Number })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  priceP2PS4: number;

  //PRICE FOR P2PS5
  @ApiProperty({ description: 'Price for P2PS5', type: Number })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  priceP2PS5: number;

  //PRICE FOR P3
  @ApiProperty({ description: 'Price for P3', type: Number })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  priceP3: number;

  //P1 STATUS
  @ApiProperty({
    description: 'P1 status',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P1: boolean;

  //P2 STATUS FOR PS4
  @ApiProperty({
    description: 'P2 status for PS4',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P2PS4: boolean;

  //P2 STATUS FOR PS5
  @ApiProperty({
    description: 'P2 status for PS5',
    type: Boolean,
  })
  @Column({ type: 'boolean', default: false })
  P2PS5: boolean;
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
