import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { AlarmService } from '../services/alarm.service';
import { SetAlarmRequest } from './model/set-alarm-request';

@ApiTags('Alarm')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('alarm')
export class AlarmController {
  public constructor(private readonly _alarmService: AlarmService) {}

  @Put('set')
  public async setAlarm(@Body() request: SetAlarmRequest): Promise<void> {
    await this._alarmService.setAlarm(request.isOn);
  }
}
