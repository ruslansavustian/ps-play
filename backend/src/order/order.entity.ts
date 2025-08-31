import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/account/account.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Customer name',
    type: String,
  })
  @Column({ length: 100 })
  customerName: string;

  @ApiProperty({
    description: 'Customer email',
    type: String,
  })
  @Column({ length: 100, nullable: true })
  email?: string;

  @ApiProperty({
    description: 'Customer telegram',
    type: String,
  })
  @Column({ length: 100, nullable: true })
  telegram?: string;

  @ApiProperty({
    description: 'Phone number',
    type: String,
  })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({
    description: 'Platform for the order (PS4 or PS5)',
    type: String,
  })
  @Column({ length: 10 })
  platform: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  notes?: string;

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

  @ApiProperty({
    description: 'Customer account',
    type: Account,
  })
  @ManyToOne(() => Account, (account) => account.orders)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ApiProperty({
    description: 'Account ID',
    type: Number,
  })
  @Column({ nullable: true })
  accountId: number;

  @ApiProperty({
    description: 'Purchase type',
    type: String,
  })
  @Column({ nullable: true })
  purchaseType: string;
}
