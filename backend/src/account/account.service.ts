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
          const games = await this.gameRepository.find({
            where: { id: In(account.gameIds) },
            select: ['id', 'name'],
          });

          account.games = games;
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

  async loadGamesForAccount(account: Account): Promise<Account> {
    if (account.gameIds && account.gameIds.length > 0) {
      const games = await this.gameRepository.find({
        where: { id: In(account.gameIds) },
        select: ['id', 'name'],
      });
      account.games = games;
    } else {
      account.games = [];
    }
    return account;
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      gameIds: createAccountDto.gameIds,
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
    const savedAccount = await this.accountRepository.save(account);
    const accountWithGames = await this.loadGamesForAccount(savedAccount);
    return accountWithGames;
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
    const account = await this.accountRepository.findOne({ where: { id } });

    if (account) {
      const accountsWithGames = await this.loadGamesForAccounts([account]);
      return accountsWithGames[0];
    }

    return null;
  }

  async update(
    id: number,
    updateData: UpdateAccountDto,
  ): Promise<Account | null> {
    if (Object.keys(updateData).length > 0)
      await this.accountRepository.update(id, updateData);
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
