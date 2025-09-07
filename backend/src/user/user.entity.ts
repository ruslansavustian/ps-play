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
import { Role } from './role.entity';
import { DEFAULT_ROLE_ID } from 'src/constants/role.types';
import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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
  @Exclude()
  @Column({ length: 255 })
  password: string;

  @ApiProperty({
    description: 'Salt used for hashing',
    type: String,
    nullable: true,
  })
  @Column({ nullable: true })
  salt: string | null;

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

  @ApiProperty({ description: 'User role', type: () => Role })
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ApiProperty({ description: 'Role ID', type: Number })
  @Column({ nullable: true, default: DEFAULT_ROLE_ID })
  roleId: number;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
