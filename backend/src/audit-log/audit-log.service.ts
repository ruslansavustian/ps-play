import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

export interface CreateAuditLogDto {
  userId: number;
  action: string;
  entityType: string;
  entityId?: number;
  description: string;
  metadata?: any;
  ipAddress: string;
  userAgent: string;
}
@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async createLog(data: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(data);
    return await this.auditLogRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { userId: userId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByEntityType(entityType: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { entityType },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { action },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async getCount(): Promise<number> {
    return await this.auditLogRepository.count();
  }

  async findLatest(): Promise<AuditLog | null> {
    return await this.auditLogRepository.findOne({
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }
}
