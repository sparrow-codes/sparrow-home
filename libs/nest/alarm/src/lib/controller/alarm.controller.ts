import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { AlarmService } from '../services/alarm.service';
import { SetAlarm } from './model/set-alarm';
import { SetAlarmModeRequest } from './model/set-alarm-mode.request';

@ApiTags('Alarm')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('alarm')
export class AlarmController {
  public constructor(private readonly _alarmService: AlarmService) {}

  @ApiOperation({ operationId: 'setAlarm' })
  @Put('set')
  public async setAlarm(@Body() request: SetAlarm): Promise<void> {
    await this._alarmService.setAlarm(request.isOn);
  }

  @ApiOperation({ operationId: 'setAlarmMode' })
  @Put('set-mode')
  public async setAlarmMode(@Body() request: SetAlarmModeRequest): Promise<void> {
    await this._alarmService.setAlarmMode(request.isActive);
  }

  @ApiOperation({ operationId: 'getAlarmMode' })
  @Get('mode')
  public async getAlarmMode(): Promise<boolean> {
    return this._alarmService.getAlarmMode();
  }
}
