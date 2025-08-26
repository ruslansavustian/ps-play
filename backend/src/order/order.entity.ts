import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Phone number',
    type: String,
  })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({
    description: 'Game name',
    type: String,
  })
  @Column({ length: 100 })
  gameName: string;

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
}
