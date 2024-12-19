import { Controller, Get, Put, Req } from '@nestjs/common';
import { Request } from 'express';

import { User } from '../../../entities/user';
import { UserRole } from '../../../enums/user-role';
import { UserService } from '../../user/services/user.service';
import { SetupService } from '../services/setup.service';
import { GetSetupResponseMapper } from './mapper/get-setup-response-mapper';
import { GetSetupResponse } from './models/get-setup.response';
import { SetConfigurationRequest } from './models/set-configuration.request';

@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService, private readonly _userService: UserService) {}

  @Get('ready')
  public isConfigurationReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @Get('current')
  public async getCurrentSetup(): Promise<GetSetupResponse> {
    const user: User = await this._userService.getUserByRole(UserRole.OWNER);
    return GetSetupResponseMapper.map(user.setup);
  }

  @Put('config-change')
  public async changeConfiguration(@Req() request: Request<SetConfigurationRequest>): Promise<void> {
    await this._setupService.saveConfiguration(request.body);
  }
}
