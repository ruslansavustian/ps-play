import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountStatus, GamePlatform } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: Partial<CreateAccountDto>,
  ): Promise<Account | null> {
    await this.accountRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }

  async findByPlatform(platform: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { platform: platform as GamePlatform },
      order: { createdAt: 'DESC' },
    });
  }

  async findAvailable(): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { status: AccountStatus.AVAILABLE },
      order: { createdAt: 'DESC' },
    });
  }
}
