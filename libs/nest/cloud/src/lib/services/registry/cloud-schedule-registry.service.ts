import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJobName } from '@sparrow-server/shared';

import { PanasonicService } from '..';

@Injectable()
export class CloudScheduleRegistryService {
  public constructor(private readonly _cloudService: PanasonicService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1PM, { disabled: true, name: CronJobName.EVERY_DAY_WATER_ON })
  public async everyDayWaterOn(): Promise<void> {
    Logger.log('Setting up water heating');
    await this._cloudService.setWaterOnly(true);
  }

  @Cron('0 30 14 * * 1-7', { disabled: true, name: CronJobName.EVERY_DAY_WATER_OFF })
  public async everyDayWaterOff(): Promise<void> {
    Logger.log('Setting down water heating');
    await this._cloudService.setWaterOnly(false);
  }
}
