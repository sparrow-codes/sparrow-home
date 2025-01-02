import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, User, UserRole } from '@sparrow-server/entities';
import { Commands, TuyaApiService } from '@sparrow-server/external-api';
import { CronJobName, TimeUtils } from '@sparrow-server/shared';
import { first } from 'rxjs';
import { Repository } from 'typeorm';

import { PanasonicService } from '..';

@Injectable()
export class CloudScheduleRegistryService {
  public constructor(
    private readonly _cloudService: PanasonicService,
    private readonly _tuyaApiService: TuyaApiService,
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {}

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

  @Cron(new Date(), { disabled: true, name: CronJobName.EVERY_DAY_CIRCULAR_PUMP })
  public async everyDayCircularPump(): Promise<void> {
    Logger.log('Starting scheduled task: Setting up water circular pump');
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    const cloudPreferences: CloudPreferences | undefined = user?.cloudPreferences;

    if (
      cloudPreferences &&
      cloudPreferences.circularPumpStartTime &&
      cloudPreferences.circularPumpEndTime &&
      cloudPreferences.tuyaDevice
    ) {
      const timeInterval: number = TimeUtils.getTimeIntervalInSeconds(
        cloudPreferences.circularPumpStartTime,
        cloudPreferences.circularPumpEndTime
      );
      Logger.log(`Turning Circular pump for ${timeInterval} seconds`);
      this._tuyaApiService
        .sendCommands(cloudPreferences.tuyaDevice.tuyaDeviceId, this._prepareLightCommands(timeInterval))
        .pipe(first())
        .subscribe();
    } else {
      Logger.warn('Invalid Circular pump configuration!');
    }
  }

  private _prepareLightCommands(timeIntervalInSeconds: number): Commands<boolean | number>[] {
    return [
      {
        code: 'switch_1',
        value: true,
      },
      {
        code: 'countdown_1',
        value: timeIntervalInSeconds,
      },
    ];
  }
}
