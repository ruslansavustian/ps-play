import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private readonly logger = new Logger(RedisService.name);
  private getChatKey(sessionId: string): string {
    return `chat:${sessionId}`;
  }
  // Save chat messages to cache
  async setChatMessages(sessionId: string, messages: any[]): Promise<void> {
    const key = this.getChatKey(sessionId);
    await this.cacheManager.set(key, messages, 600000);
  }

  // Get chat messages from cache
  async getChatMessages(sessionId: string): Promise<any[] | null> {
    const key = this.getChatKey(sessionId);
    this.logger.log(`Getting chat messages from cache: ${key}`);
    return await this.cacheManager.get(key);
  }

  // Delete chat messages from cache
  async deleteChatMessages(sessionId: string): Promise<void> {
    const key = this.getChatKey(sessionId);
    await this.cacheManager.del(key);
  }

  // Add new message to cache
  async addMessageToCache(sessionId: string, message: any): Promise<void> {
    const existingMessages = (await this.getChatMessages(sessionId)) || [];
    existingMessages.push(message);
    this.logger.log('All messages:', JSON.stringify(existingMessages, null, 2));
    await this.setChatMessages(sessionId, existingMessages);
  }
}
