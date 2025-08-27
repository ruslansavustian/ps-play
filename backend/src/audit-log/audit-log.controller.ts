import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll() {
    return await this.auditLogService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Query('userId') userId: number) {
    return await this.auditLogService.findByUserId(userId);
  }

  @Get('entity/:entityType')
  async findByEntityType(@Query('entityType') entityType: string) {
    return await this.auditLogService.findByEntityType(entityType);
  }

  @Get('action/:action')
  async findByAction(@Query('action') action: string) {
    return await this.auditLogService.findByAction(action);
  }

  @Get('count')
  async getCount() {
    const count = await this.auditLogService.getCount();
    return { count };
  }
}
