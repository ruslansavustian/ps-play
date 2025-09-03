import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const game = this.gameRepository.create(createGameDto);
    return await this.gameRepository.save(game);
  }

  async findAll(): Promise<Game[]> {
    // Получаем только активные игры
    const activeGames = await this.gameRepository.find({
      where: { isDeleted: false },
    });

    return activeGames;
  }

  async findOne(id: number): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { id, isDeleted: false }, // Ищем только неудаленные игры
    });
  }

  async findByName(name: string): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { name, isDeleted: false }, // Ищем только неудаленные игры
    });
  }

  async update(
    id: number,
    updateData: Partial<CreateGameDto>,
  ): Promise<Game | null> {
    await this.gameRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Game> {
    const gameToDelete = await this.gameRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!gameToDelete) {
      throw new Error('Game not found');
    }
    await this.gameRepository.update(id, { isDeleted: true });

    return {
      ...gameToDelete,
      isDeleted: true,
    };
  }
}
