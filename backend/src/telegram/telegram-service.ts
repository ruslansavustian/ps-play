import { Injectable } from '@nestjs/common';
import { Order } from 'src/order/order.entity';
import * as TelegramBot from 'node-telegram-bot-api';

interface TicketData {
  id: string;
  userName: string;
  initialMessage: string;
}

@Injectable()
export class TelegramService {
  private bot: TelegramBot | null = null;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (token) {
      try {
        this.bot = new TelegramBot(token, {
          polling: false,
        });
      } catch (error) {
        console.error(
          '❌ [TELEGRAM] Failed to create TelegramBot instance:',
          error,
        );
      }
    } else {
      console.warn(
        '⚠️ [TELEGRAM] TELEGRAM_BOT_TOKEN not found in environment variables',
      );
      console.warn(
        '⚠️ [TELEGRAM] Available env vars:',
        Object.keys(process.env).filter((key) => key.includes('TELEGRAM')),
      );
    }
  }

  async sendNotification(message: string) {
    if (!this.bot) {
      console.warn('⚠️ [TELEGRAM] Telegram bot not initialized');
      return;
    }

    try {
      // Отправляем сообщение в ваш чат
      const targetChatId = process.env.TELEGRAM_CHAT_ID;

      if (!targetChatId) {
        console.warn(
          '⚠️ [TELEGRAM] TELEGRAM_CHAT_ID not found in environment variables',
        );
        return;
      }

      await this.bot.sendMessage(targetChatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    } catch (error: any) {
      console.error('❌ [TELEGRAM] Telegram notification failed:', error);
    }
  }

  async sendOrderNotification(orderData: Order) {
    const message = `
🛒 <b>Новый заказ!</b>

📋 <b>Детали заказа:</b>
• ID: ${orderData.id}
• Клиент: ${orderData.customerName}
• Телеграм: ${orderData.telegram}
• Телефон: ${orderData.phone}
• Платформа: ${orderData.platform}
• Аккаунт: ${orderData.accountId}
• Дата: ${new Date().toLocaleString('ru-RU')}
• Комментарий: ${orderData.notes}


    `;

    await this.sendNotification(message);
  }

  async sendSupportNotification(ticketData: TicketData) {
    const message = `
🆘 <b>Новое обращение в поддержку!</b>

👤 <b>Клиент:</b> ${ticketData.userName}
💬 <b>Сообщение:</b> ${ticketData.initialMessage}
📅 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}

🔗 <a href="${process.env.FRONTEND_URL}/admin/support/${ticketData.id}">Ответить</a>
    `;

    await this.sendNotification(message);
  }
}
