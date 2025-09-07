import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Role name', type: String, maxLength: 50 })
  @Column({ unique: true, length: 50 })
  name: string;

  @ApiProperty({
    description: 'Role description',
    type: String,
    maxLength: 255,
  })
  @Column({ length: 255, nullable: true })
  description: string;

  @ApiProperty({ description: 'Role permissions', type: [String] })
  @Column({ type: 'json', nullable: true })
  permissions: string[];

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

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
