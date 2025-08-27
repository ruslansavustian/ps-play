import { SetMetadata } from '@nestjs/common';

export interface AuditLogOptions {
  action: string;
  entityType: string;
  description: string;
}

export const AUDIT_LOG_KEY = 'auditLog';

export function AuditLog(options: AuditLogOptions) {
  return SetMetadata(AUDIT_LOG_KEY, options);
}
