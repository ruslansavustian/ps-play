import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Headers,
  OnModuleInit,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(private authService: AuthService) {}

  onModuleInit() {}

  @Post('init-session')
  @Public()
  @ApiOperation({ summary: 'Initialize authentication session' })
  @ApiResponse({
    status: 201,
    description: 'Session initialized successfully',
    schema: {
      example: {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        expiresAt: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  initSession() {
    return this.authService.initSession();
  }
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User login with Basic Auth' })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(
    @Body() loginDto: LoginDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.authService.loginWithBasicAuth(loginDto, authHeader);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(Number(req.user.id));
  }
}
