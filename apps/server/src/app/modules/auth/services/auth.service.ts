import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../../user/enitities/user';
import { UserService } from '../../user/services/user.service';
import { TokenPayload } from './model/token-payload';

@Injectable()
export class AuthService {
  private static readonly AUTH_HEADER_PREFIX: string = 'Bearer';

  public constructor(private readonly _userService: UserService, private readonly _jwtService: JwtService) {}

  public async login(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new UnauthorizedException();
    }

    const user: User | null = await this._userService.getUserByEmail(email);
    if (user === null || (await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload: TokenPayload = {
      userId: user.id,
    };

    return await this._jwtService.signAsync(payload);
  }

  public async refreshToken(authHeaderValue: string | null): Promise<string> {
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
}
