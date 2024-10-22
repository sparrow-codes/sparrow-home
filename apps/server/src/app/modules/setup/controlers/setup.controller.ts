import { Controller, Get, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';

import { User } from '../../../entities/user';
import { getUserId } from '../../../utils/request-util';
import { UserService } from '../../user/services/user.service';
import { SetupService } from '../services/setup.service';
import { GetSetupResponseMapper } from './mapper/get-setup-response-mapper';
import { GetSetupResponse } from './models/get-setup.response';
import { SetConfigurationRequest } from './models/set-configuration.request';
import { SetModeRequest } from './models/set-mode.request';

@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService, private readonly _userService: UserService) {}

  @Get('ready')
  public isReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @Get('current')
  public async getCurrentSetup(@Req() request: Request): Promise<GetSetupResponse> {
    const userId: number = getUserId(request);
    const user: User = await this._userService.getUserById(userId);
    return GetSetupResponseMapper.map(user.setup);
  }

  @Post('set-mode')
  public async setMode(@Req() request: Request<SetModeRequest>): Promise<void> {
    const userId: number = getUserId(request);
    return this._setupService.setMode(request.body.mode, userId);
  }

  @Put('config-change')
  public async changeConfiguration(@Req() request: Request<SetConfigurationRequest>): Promise<void> {
    const userId: number = getUserId(request);
    await this._setupService.saveConfiguration(request.body, userId);
  }
}
