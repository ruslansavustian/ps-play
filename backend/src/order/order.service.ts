import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

import { TelegramService } from '../telegram/telegram-service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private telegramService: TelegramService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    await this.telegramService.sendOrderNotification(savedOrder);
    return savedOrder;
  }
  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getOrderById(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async updateOrder(
    id: number,
    updateOrderDto: CreateOrderDto,
  ): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
