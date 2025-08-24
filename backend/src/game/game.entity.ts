import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  created: Date;
}
