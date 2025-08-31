import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './game.entity';

@ApiTags('Games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: 200, description: 'Games retrieved successfully' })
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    const game = await this.gameService.findOne(id);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game updated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameDto: Partial<CreateGameDto>,
  ): Promise<Game> {
    const game = await this.gameService.update(id, updateGameDto);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    return this.gameService.remove(id);
  }
}
