import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from '../services/user.service';
import { CreateNewUserRequest } from './model/create-new-user-request';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post('create-first')
  public async createNewUser(@Body() request: CreateNewUserRequest): Promise<void> {
    await this.userService.createFirstUser(request);
  }
}
