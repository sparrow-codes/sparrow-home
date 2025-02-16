import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from './models/login-request';
import { LoginResponse } from './models/login-response';
import { RefreshTokenResponse } from './models/refresh-token.response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ operationId: 'login' })
  @ApiResponse({ type: LoginResponse })
  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return {
      token: await this.authService.login(request.email, request.password),
    };
  }

  @ApiOperation({ operationId: 'refreshToken' })
  @UseGuards(AuthGuard)
  @ApiResponse({ type: RefreshTokenResponse })
  @Get('/refresh')
  public async refreshToken(@Headers('Authorization') authHeaderValue: string): Promise<RefreshTokenResponse> {
    return {
      token: await this.authService.refreshToken(authHeaderValue),
    };
  }
}
