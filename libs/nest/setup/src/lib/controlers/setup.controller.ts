import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { SetupService } from '../services/setup.service';
import { GetVacationModeResponse } from './models/get-vacation-mode.response';
import { SetVacationModeRequest } from './models/set-vacation-mode.request';

@ApiTags('Setup')
@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService) {}

  @ApiOperation({ operationId: 'isConfigurationReady' })
  @Get('ready')
  public isConfigurationReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'setVacationMode' })
  @ApiBody({ type: SetVacationModeRequest })
  @Put('set-vacation-mode')
  public async setVacationMode(@Body() request: SetVacationModeRequest): Promise<void> {
    await this._setupService.setVacationMode(request.isVacationMode);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getVacationMode' })
  @ApiResponse({ type: GetVacationModeResponse })
  @Get('vacation-mode')
  public async getVacationMode(): Promise<GetVacationModeResponse> {
    return { isVacationMode: await this._setupService.getVacationMode() };
  }
}
