import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiChatSession } from './entities/ai-chat-session.entity';
import { AiMessage } from './entities/ai-message.entity';
import { Account } from '../account/account.entity';
import { Game } from '../game/game.entity';
import { Order } from '../order/order.entity';
import { OrderService } from '../order/order.service';
import { TelegramService } from '../telegram/telegram-service';
import { AccountService } from '../account/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiChatSession, AiMessage, Account, Game, Order]),
  ],
  controllers: [AiController],
  providers: [AiService, OrderService, TelegramService, AccountService],
  exports: [AiService],
})
export class AiModule {}
