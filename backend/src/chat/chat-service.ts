import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(chatMessageDto: ChatMessageDto): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create({
      message: chatMessageDto.message,
      userName: chatMessageDto.userName || 'Anonymous',
      userId: chatMessageDto.userId,
    });
    return await this.chatMessageRepository.save(message);
  }

  async getRecentMessages(limit: number = 50): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
