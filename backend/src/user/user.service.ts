import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from './role.entity';

import { RoleNames, RoleType } from 'src/constants/role.types';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async updateUser(
    userId: number,
    updateData: { name?: string; email?: string; password?: string },
  ): Promise<User> {
    console.log();
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);

    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.userRepository.save(user);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async createDefaultRoles(): Promise<void> {
    const roles = [
      {
        id: RoleType.ADMIN,
        name: RoleNames[RoleType.ADMIN],
        description: 'Administrator',
        permissions: ['all'],
      },
      {
        id: RoleType.USER,
        name: RoleNames[RoleType.USER],
        description: 'Regular user',
        permissions: ['read'],
      },
      {
        id: RoleType.MODERATOR,
        name: RoleNames[RoleType.MODERATOR],
        description: 'Moderator',
        permissions: ['read', 'moderate'],
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { id: roleData.id },
      });
      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
  }
  async assignRole(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'], // ← Загружаем роль сразу
    });

    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }

    user.roleId = roleId;
    user.role = role; // ← Устанавливаем объект роли

    return this.userRepository.save(user);
  }

  async getUserWithRole(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
  }

  async getAllUsersWithRoles(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
