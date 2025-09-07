import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  @Get()
  async getAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
