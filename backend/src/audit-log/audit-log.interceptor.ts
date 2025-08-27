/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { AUDIT_LOG_KEY, AuditLogOptions } from './audit-log.decorator';
import { User } from '../user/user.entity';
import { Request } from 'express';
import { UpdateAccountDto } from 'src/account/dto/update-account.dto';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private auditLogService: AuditLogService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLogOptions = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!auditLogOptions) {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();

    const user = request.user;

    const ipAddress = request.ip || '';
    const userAgent = request.headers['user-agent'] || '';

    return next.handle().pipe(
      tap((result) => {
        // Используем setTimeout для асинхронного логирования без блокировки
        setTimeout(() => {
          if (auditLogOptions) {
            const requestBody = request.body as UpdateAccountDto;
            const metadata = {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
              result: result as any,
              changes: requestBody,
            };

            this.auditLogService
              .createLog({
                userId: user?.id || 0,
                action: auditLogOptions.action,
                entityType: auditLogOptions.entityType,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
                entityId: (result as any)?.id,
                description: auditLogOptions.description,
                metadata: metadata,
                ipAddress,
                userAgent,
              })
              .catch((error) => {
                console.error('Failed to create audit log:', error);
              });
          }
        }, 0);
      }),
    );
  }
}
