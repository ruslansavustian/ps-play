import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, User } from './user.entity';
import { Logger } from '@nestjs/common';
import { Role } from './role.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Get()
  getAll(): Promise<User[]> {
    this.logger.log('Getting all users');
    return this.userService.getAllUsersWithRoles();
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    this.logger.log(`Updating user ${id}`);
    this.logger.log(`User data: ${JSON.stringify(user)}`);
    return this.userService.updateUser(id, user);
  }

  @Post('roles/init')
  async initRoles(): Promise<{ message: string }> {
    await this.userService.createDefaultRoles();
    return { message: 'Roles initialized successfully' };
  }

  @Get('roles')
  async getAllRoles(): Promise<Role[]> {
    return this.userService.getAllRoles();
  }

  @Put(':id/role')
  async assignRole(
    @Param('id') userId: number,
    @Body() body: { roleId: number },
  ): Promise<User> {
    this.logger.log(`Assigning role ${body.roleId} to user ${userId}`);
    return this.userService.assignRole(userId, body.roleId);
  }

  @Get(':id')
  getUserWithRole(@Param('id') userId: number): Promise<User> {
    this.logger.log(`Getting user ${userId} with role`);
    return this.userService.getUserWithRole(userId);
  }
}
