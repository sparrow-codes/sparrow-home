import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@sparrow-server/auth';
import { Request } from 'express';

import { SetupService } from '../services/setup.service';
import { GetSetupResponse } from './models/get-setup.response';
import { SetConfigurationRequest } from './models/set-configuration.request';

@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService) {}

  @Get('ready')
  public isConfigurationReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @UseGuards(AuthGuard)
  @Get('current')
  public async getCurrentSetup(): Promise<GetSetupResponse> {
    return this._setupService.getUserConfiguration();
  }

  @Put('config-change')
  public async changeConfiguration(@Req() request: Request<SetConfigurationRequest>): Promise<void> {
    await this._setupService.saveConfiguration(request.body);
  }
}
