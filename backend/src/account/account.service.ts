import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { Game } from '../game/game.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      games: { id: createAccountDto.games } as Game,
      platform: createAccountDto.platform,
      pricePS: createAccountDto.pricePS,
      pricePS4: createAccountDto.pricePS4,
    });
    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      order: { created: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: Partial<CreateAccountDto>,
  ): Promise<Account | null> {
    const updatePayload: Partial<Account> = {};

    // Only copy properties that exist in Account entity
    if (updateData.platform !== undefined) {
      updatePayload.platform = updateData.platform;
    }
    if (updateData.pricePS !== undefined) {
      updatePayload.pricePS = updateData.pricePS;
    }
    if (updateData.pricePS4 !== undefined) {
      updatePayload.pricePS4 = updateData.pricePS4;
    }

    // Handle games property separately - convert to games relation
    if (updateData.games !== undefined) {
      updatePayload.games = { id: updateData.games } as Game;
    }

    await this.accountRepository.update(id, updatePayload);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }

  async findByPlatform(platform: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { platform },
      order: { created: 'DESC' },
    });
  }
}
