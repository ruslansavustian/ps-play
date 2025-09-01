import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Game } from 'src/game/game.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  private async loadGamesForAccounts(accounts: Account[]): Promise<Account[]> {
    for (const account of accounts) {
      if (account.gameIds && account.gameIds.length > 0) {
        try {
          // Загружаем только id и name
          const games = await this.gameRepository.find({
            where: { id: In(account.gameIds) },
            select: ['id', 'name'], // Только нужные поля
          });

          account.games = games;
          console.log(
            `Loaded ${games.length} games for account ${account.id}:`,
            games,
          );
        } catch (error) {
          console.error(
            `Error loading games for account ${account.id}:`,
            error,
          );
          account.games = [];
        }
      } else {
        account.games = [];
      }
    }
    return accounts;
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      gameIds: createAccountDto.gamesIds,
      platformPS4: createAccountDto.platformPS4,
      platformPS5: createAccountDto.platformPS5,
      priceP1: createAccountDto.priceP1 || 0,
      priceP2PS4: createAccountDto.priceP2PS4 || 0,
      priceP2PS5: createAccountDto.priceP2PS5 || 0,
      priceP3: createAccountDto.priceP3 || 0,
      priceP3A: createAccountDto.priceP3A || 0,
      P1: createAccountDto.P1 || false,
      P2PS4: createAccountDto.P2PS4 || false,
      P2PS5: createAccountDto.P2PS5 || false,
      P3: createAccountDto.P3 || false,
      P3A: createAccountDto.P3A || false,
    });
    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.accountRepository.find({
      order: { created: 'DESC' },
      where: { isDeleted: false },
    });

    const accountsWithGames = await this.loadGamesForAccounts(accounts);
    return accountsWithGames;
  }

  async findOne(id: number): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: UpdateAccountDto,
  ): Promise<Account | null> {
    const updatePayload: Partial<Account> = {};

    if (updateData.platformPS4 !== undefined) {
      updatePayload.platformPS4 = updateData.platformPS4;
    }
    if (updateData.platformPS5 !== undefined) {
      updatePayload.platformPS5 = updateData.platformPS5;
    }
    if (updateData.priceP1 !== undefined) {
      updatePayload.priceP1 = updateData.priceP1 || 0;
    }
    if (updateData.priceP2PS5 !== undefined) {
      updatePayload.priceP2PS5 = updateData.priceP2PS5 || 0;
    }
    if (updateData.priceP2PS4 !== undefined) {
      updatePayload.priceP2PS4 = updateData.priceP2PS4 || 0;
    }
    if (updateData.priceP3 !== undefined) {
      updatePayload.priceP3 = updateData.priceP3 || 0;
    }
    if (updateData.priceP3A !== undefined) {
      updatePayload.priceP3A = updateData.priceP3A || 0;
    }
    if (updateData.P1 !== undefined) {
      updatePayload.P1 = updateData.P1;
    }
    if (updateData.P2PS4 !== undefined) {
      updatePayload.P2PS4 = updateData.P2PS4;
    }
    if (updateData.P2PS5 !== undefined) {
      updatePayload.P2PS5 = updateData.P2PS5;
    }
    if (updateData.P3 !== undefined) {
      updatePayload.P3 = updateData.P3;
    }

    await this.accountRepository.update(id, updatePayload);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Account> {
    await this.accountRepository.update(id, { isDeleted: true });

    const updatedAccount = await this.findOne(id);
    if (!updatedAccount) {
      throw new Error('Game not found after soft delete');
    }
    return updatedAccount;
  }

  async findByPlatform(
    platformPS4: boolean,
    platformPS5: boolean,
  ): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { platformPS4, platformPS5 },
      order: { created: 'DESC' },
    });
  }
}
