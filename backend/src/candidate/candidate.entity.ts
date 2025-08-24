import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('candidates')
export class Candidate {
  @ApiProperty({ description: 'Unique identifier', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'First name', type: String, maxLength: 100 })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Last name', type: String, maxLength: 100 })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Birth date', type: String, format: 'date' })
  @Column({ type: 'date' })
  birthDate: Date;

  @ApiProperty({ description: 'Work experience description', type: String })
  @Column({ type: 'text' })
  workExperience: string;

  @ApiProperty({
    description: 'Technical skills and competencies',
    type: String,
  })
  @Column({ type: 'text' })
  skills: string;

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
