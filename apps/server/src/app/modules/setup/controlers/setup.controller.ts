import { Body, Controller, Get, Post } from '@nestjs/common';

import { ModeDictionary } from '../dictionaries/mode-dictionary';
import { SetupService } from '../services/setup.service';
import { GetSetupResponse } from './models/get-setup.response';
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
    const response: GetSetupResponse = new GetSetupResponse();
    response.currentMode = (await this._setupService.getSetup())[0].mode;
    response.dictionaries = {
      modeDictionary: ModeDictionary,
    };
    return response;
  }

  @Post('set-mode')
  public async setMode(@Body() request: SetModeRequest): Promise<void> {
    return this._setupService.setMode(request.mode);
  }
}
