import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsNumber()
  userId: number;

  @IsString()
  action: string;

  @IsString()
  entityType: string;

  @IsOptional()
  @IsNumber()
  entityId?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsString()
  ipAddress: string;

  @IsString()
  userAgent: string;
}
