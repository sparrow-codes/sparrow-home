import { Injectable, Logger } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { CronJobName } from '../enums/cron-job-name';
import { CloudConnectionService } from '../modules/cloud/services/cloud-connection/cloud-connection.service';

@Injectable()
export class CustomScheduleRegistryService {
  public constructor(
    private readonly _cloudService: CloudConnectionService,
    private readonly _schedulerRegistry: SchedulerRegistry
  ) {}

  public getCronJob(jobName: CronJobName): CronJob {
    const cronJob: CronJob = this._schedulerRegistry.getCronJob(jobName);
    if (!cronJob) {
      throw new RuntimeException('Missing cronJob in registry!');
    }

    return cronJob;
  }

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

  @Cron(new Date(), { disabled: true, name: CronJobName.HEAT_OFF })
  public async setHeatOff(): Promise<void> {
    Logger.log('Setting down heating');
    await this._cloudService.setHeatOnly(false);
  }

  @Cron(new Date(), { disabled: true, name: CronJobName.WATER_OFF })
  public async setWaterOff(): Promise<void> {
    Logger.log('Turning water off');
    await this._cloudService.setWaterOnly(false);
  }
}
