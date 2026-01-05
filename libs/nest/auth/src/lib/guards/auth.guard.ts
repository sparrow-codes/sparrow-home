import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@sparrow-server/entities';
import { Request } from 'express';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly _authService: AuthService, private readonly _jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headerValue: string | undefined = request.headers.authorization;

    if (!headerValue) {
      throw new UnauthorizedException();
    }

    const token: string | null = this._authService.extractTokenFromHeader(headerValue);

    if (!token) {
      throw new UnauthorizedException();
    }

    let user: User | null = null;

    try {
      user = await this._authService.getUserFromToken(token);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new UnauthorizedException();
    }

    try {
      await this._jwtService.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
