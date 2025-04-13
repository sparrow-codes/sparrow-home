import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from '@sparrow-server/auth';
import { Request } from 'express';

import { UserService } from '../services/user.service';
import { ActivateUserRequest } from './model/activate-user-request';
import { CreateNewUserRequest } from './model/create-new-user-request';
import { GetListOfAdditionalUsersResponse } from './model/get-list-of-additional-users.response';
import { GetUserDetailsResponse } from './model/get-user-details.response';

@ApiTags('User')
@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @ApiOperation({ operationId: 'createNewUser' })
  @Post('create-first')
  public async createNewUser(@Body() request: CreateNewUserRequest): Promise<void> {
    await this.userService.createFirstUser(request);
  }

  @ApiOperation({ operationId: 'createAdditionalUser' })
  @Post('create-additional')
  public async createAdditionalUser(@Body() request: CreateNewUserRequest): Promise<void> {
    await this.userService.createAdditionalUser(request);
  }

  @ApiOperation({ operationId: 'activateUser' })
  @Post('activate-user')
  public async activateUser(@Body() request: ActivateUserRequest): Promise<void> {
    await this.userService.activateUser(request.userId);
  }

  @ApiOperation({ operationId: 'getListOfAdditionalUsers' })
  @ApiResponse({ type: GetListOfAdditionalUsersResponse })
  @Get('additional-users')
  public async getListOfAdditionalUsers(): Promise<GetListOfAdditionalUsersResponse> {
    return {
      users: await this.userService.getListOfAdditionalUsers(),
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getUserDetails' })
  @ApiResponse({ type: GetUserDetailsResponse })
  @Get('details')
  public async getUserDetails(@Req() request: Request): Promise<GetUserDetailsResponse> {
    const authHeader: string | undefined = request.headers['authorization'] as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided.');
    }

    const token: string | null = this.authService.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    const userId: number = await this.authService.getUserIdFromToken(token);

    return this.userService.getUserDetails(userId);
  }
}
