import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { AlarmService } from '../services/alarm.service';
import { GetAlarmModeResponse } from './model/get-alarm-mode.response';
import { SetAlarmModeRequest } from './model/set-alarm-mode.request';

@ApiTags('Alarm')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('alarm')
export class AlarmController {
  public constructor(private readonly _alarmService: AlarmService) {}

  @ApiOperation({ operationId: 'setAlarmMode' })
  @Put('set-mode')
  public async setAlarmMode(@Body() request: SetAlarmModeRequest): Promise<void> {
    await this._alarmService.setAlarmMode(request.isActive);
  }

  @ApiOperation({ operationId: 'getAlarmMode' })
  @ApiResponse({ type: GetAlarmModeResponse })
  @Get('mode')
  public async getAlarmMode(): Promise<GetAlarmModeResponse> {
    return this._alarmService.getAlarmMode();
  }
}
