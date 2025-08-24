import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({
    description: 'Candidate first name',
    type: String, // ✅ Type-based
    minLength: 1,
    maxLength: 100,
    // Optional: simple example without exposing real data
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({
    description: 'Candidate last name',
    type: String,
    minLength: 1,
    maxLength: 100,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @ApiProperty({
    description: 'Birth date in ISO format',
    type: String,
    format: 'date', // ✅ Specifies format without example
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    description: 'Work experience description',
    type: String,
    minLength: 1,
    // No example - just describes the type
  })
  @IsString()
  @IsNotEmpty()
  workExperience: string;

  @ApiProperty({
    description: 'Technical skills',
    type: String,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  skills: string;
}
