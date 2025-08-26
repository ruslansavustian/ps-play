import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SessionDto {
  @ApiProperty({
    description: 'The session ID',
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
