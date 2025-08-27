import { IsOptional, IsString, IsNumber } from 'class-validator';

export class QueryAuditLogDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
