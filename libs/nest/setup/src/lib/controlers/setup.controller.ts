import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { Request } from 'express';

import { SetupService } from '../services/setup.service';
import { GetSetupResponse } from './models/get-setup.response';
import { SetConfigurationRequest } from './models/set-configuration.request';

@ApiTags('Setup')
@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService) {}

  @ApiOperation({ operationId: 'isConfigurationReady' })
  @Get('ready')
  public isConfigurationReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @ApiOperation({ operationId: 'getCurrentSetup' })
  @UseGuards(AuthGuard)
  @ApiResponse({ type: GetSetupResponse })
  @Get('current')
  public async getCurrentSetup(): Promise<GetSetupResponse> {
    return this._setupService.getUserConfiguration();
  }

  @ApiOperation({ operationId: 'changeConfiguration' })
  @UseGuards(AuthGuard)
  @Put('config-change')
  public async changeConfiguration(@Req() request: Request<SetConfigurationRequest>): Promise<void> {
    await this._setupService.saveConfiguration(request.body);
  }
}
