import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly _authService: AuthService, private readonly _jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headerValue: string = request.headers.authorization;
    const token: string | null = this._authService.extractTokenFromHeader(headerValue);

    try {
      await this._jwtService.signAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
