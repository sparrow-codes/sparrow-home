import { Body, Controller, Get, Post, Put } from '@nestjs/common';

import { SetupService } from '../services/setup.service';
import { GetSetupResponseMapper } from './mapper/get-setup-response-mapper';
import { GetSetupResponse } from './models/get-setup.response';
import { SetConfigurationRequest } from './models/set-configuration.request';
import { SetModeRequest } from './models/set-mode.request';

@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService) {}

  @Get('ready')
  public isReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @Get('current')
  public async getCurrentSetup(): Promise<GetSetupResponse> {
    return GetSetupResponseMapper.map(await this._setupService.getSetup());
  }

  @Post('set-mode')
  public async setMode(@Body() request: SetModeRequest): Promise<void> {
    return this._setupService.setMode(request.mode);
  }

  @Put('config-change')
  public async changeConfiguration(@Body() request: SetConfigurationRequest): Promise<void> {
    await this._setupService.saveConfiguration(request);
  }
}
