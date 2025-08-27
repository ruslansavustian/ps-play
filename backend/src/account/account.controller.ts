import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuditLog } from '../audit-log/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/audit-log.interceptor';
import { UseInterceptors } from '@nestjs/common';

@ApiTags('Gaming Accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditLogInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @AuditLog({
    action: 'CREATE_ACCOUNT',
    entityType: 'ACCOUNT',
    description: 'Создан новый игровой аккаунт',
  })
  @ApiOperation({ summary: 'Create a new gaming account' })
  @ApiResponse({
    status: 201,
    description: 'Gaming account created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gaming accounts' })
  @ApiQuery({
    name: 'platform',
    required: false,
    description: 'Filter by platform',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    description: 'Show only available accounts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of gaming accounts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('platformPS4') platformPS4?: boolean,
    @Query('platformPS5') platformPS5?: boolean,
  ) {
    if (platformPS4 || platformPS5) {
      return this.accountService.findByPlatform(platformPS4, platformPS5);
    }
    return this.accountService.findAll();
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all gaming accounts (public endpoint)' })
  @ApiQuery({
    name: 'platform',
    required: false,
    description: 'Filter by platform',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    description: 'Show only available accounts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of gaming accounts retrieved successfully',
  })
  findPublic(
    @Query('platformPS4') platformPS4?: boolean,
    @Query('platformPS5') platformPS5?: boolean,
  ) {
    if (platformPS4 || platformPS5) {
      return this.accountService.findByPlatform(platformPS4, platformPS5);
    }
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gaming account by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Gaming account found' })
  @ApiResponse({ status: 404, description: 'Gaming account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Put(':id')
  @AuditLog({
    action: 'UPDATE_ACCOUNT',
    entityType: 'ACCOUNT',
    description: 'Обновлен игровой аккаунт',
  })
  @ApiOperation({ summary: 'Update gaming account by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Gaming account updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Gaming account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @AuditLog({
    action: 'DELETE_ACCOUNT',
    entityType: 'ACCOUNT',
    description: 'Удален игровой аккаунт',
  })
  @ApiOperation({ summary: 'Delete gaming account by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Gaming account deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Gaming account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
