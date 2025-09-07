import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController, RoleController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
