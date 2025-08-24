import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User full name', type: String, maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'User email address',
    type: String,
    format: 'email',
    maxLength: 255,
  })
  @Column({ unique: true, length: 255 })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    type: String,
    writeOnly: true,
    maxLength: 255,
  })
  @Column({ length: 255 })
  password: string;

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
