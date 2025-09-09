import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Entity('games')
export class Game {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Game name',
    type: String,
    example: 'FIFA 24',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'abbreviation',
    type: String,
    example: 'FC26',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  abbreviation: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  created: Date;

  @ApiProperty({
    description: 'Deleted',
    type: String,
    example: 'true',
    format: 'boolean',
  })
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Deleted At',
    type: String,
    example: '2025-01-01',
    format: 'date-time',
  })
  @IsOptional()
  @Column({ type: 'date', nullable: true })
  deletedAt?: string;

  @ApiProperty({
    description: 'Photo URL',
    type: String,
    example: 'https://example.com/photo.jpg',
  })
  @Column({ nullable: true })
  photoUrl: string;
}
