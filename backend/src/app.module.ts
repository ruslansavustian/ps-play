import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Account } from './account/account.entity';
import { AccountModule } from './account/account.module';
import { Game } from './game/game.entity';
import { GameModule } from './game/game.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditLog } from './audit-log/audit-log.entity';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/chat-message.entity';
import { S3Module } from './s3/s3.module';
import { AiModule } from './ai/ai.module';
import { AiChatSession } from './ai/entities/ai-chat-session.entity';
import { AiMessage } from './ai/entities/ai-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          User,
          Account,
          Game,
          Order,
          AuditLog,
          ChatMessage,
          AiChatSession,
          AiMessage,
        ],
        synchronize: true,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    UserModule,
    AccountModule,
    GameModule,
    OrderModule,
    AuditLogModule,
    ChatModule,
    S3Module,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {}
}
