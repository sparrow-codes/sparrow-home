import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { CreateNewUserRequest } from './model/create-new-user-request';

@ApiTags('User')
@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @ApiOperation({ operationId: 'createNewUser' })
  @Post('create-first')
  public async createNewUser(@Body() request: CreateNewUserRequest): Promise<void> {
    await this.userService.createFirstUser(request);
  }
}
