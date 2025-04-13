import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@sparrow-server/entities';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { TokenPayload } from './model/token-payload';

@Injectable()
export class AuthService {
  private static readonly AUTH_HEADER_PREFIX: string = 'Bearer';

  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _jwtService: JwtService
  ) {}

  public async login(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new UnauthorizedException();
    }

    const user: User | null = await this._userRepository.findOneBy({ email });
    if (user === null || !(await bcrypt.compare(password, user.password)) || !user.isActive) {
      throw new UnauthorizedException();
    }

    const payload: TokenPayload = {
      userId: user.id,
    };

    return await this._jwtService.signAsync(payload);
  }

  public async refreshToken(authHeaderValue: string | null): Promise<string> {
    if (!authHeaderValue) {
      throw new UnauthorizedException();
    }

    const token: string | null = this.extractTokenFromHeader(authHeaderValue);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: TokenPayload = await this._jwtService.verifyAsync(token);
      return await this._jwtService.signAsync(payload);
    } catch {
      throw new UnauthorizedException();
    }
  }

  public extractTokenFromHeader(authHeaderValue: string): string | null {
    const [type, token] = authHeaderValue?.split(' ') ?? [];
    return type === AuthService.AUTH_HEADER_PREFIX ? token : null;
  }

  public async getUserFromToken(token: string): Promise<User> {
    const payload: TokenPayload = await this._jwtService.verifyAsync(token);
    const user: User | null = await this._userRepository.findOneBy({ id: payload.userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  public async getUserIdFromToken(token: string): Promise<number> {
    const payload: TokenPayload = await this._jwtService.verifyAsync(token);
    return payload.userId;
  }
}
