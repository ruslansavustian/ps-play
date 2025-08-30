import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private activeSessions = new Map<string, { expiresAt: Date }>();
  initSession() {
    const uuid = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    this.activeSessions.set(uuid, { expiresAt });

    return {
      uuid,
      expiresAt: expiresAt.toISOString(),
    };
  }
  async register(registerDto: RegisterDto) {
    const { name, email, hashedPassword } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.createWithSalt(
      name,
      email,
      hashedPassword,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    const payload = { username: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: result,
    };
  }
  private verifyHashedPassword = (
    hashedPassword: string,
    storedPassword: string,
  ): boolean => {
    return hashedPassword === storedPassword;
  };
  async loginWithBasicAuth(loginDto: LoginDto, authHeader: string) {
    const { uuid } = loginDto;

    const session = this.activeSessions.get(uuid);
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    this.activeSessions.delete(uuid);

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        throw new UnauthorizedException('Invalid credentials format');
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const hashedPassword = CryptoJS.SHA256(password).toString();
      const isPasswordValid = hashedPassword === user.password;

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { username: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return {
        access_token,
        user: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateBasicAuth(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new BadRequestException('Invalid authorization header');
    }

    try {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        throw new UnauthorizedException('Invalid credentials format');
      }

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { username: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return {
        access_token,
        user: result,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
