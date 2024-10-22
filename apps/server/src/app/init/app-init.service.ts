import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CloudPreferences } from '../entities/cloud-preferences';
import { User } from '../entities/user';
import { CronJobName } from '../enums/cron-job-name';
import { CloudConnectionService } from '../modules/cloud/services/cloud-connection/cloud-connection.service';
import { ModeService } from '../modules/setup/services/mode/mode.service';
import { scheduleHeatOff, scheduleHeatOn } from '../modules/task/functions/heat-functions';
import { UserRole } from '../modules/user/enum/user-role';
import { UserService } from '../modules/user/services/user.service';

@Injectable()
export class AppInitService {
  public constructor(
    private readonly _userService: UserService,
    private readonly _modeService: ModeService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _cloudService: CloudConnectionService
  ) {}

  public async onInit(): Promise<void> {
    Logger.log('Verifying application configuration');
    try {
      const owner: User = await this._userService.getUserByRole(UserRole.OWNER);
      await this._verifyMode(owner);
      await this._verifyCloudScheduledTask(owner);
      await this._verifyScheduleHeating(owner);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        Logger.log('No user found. Initial configuration required');
      } else {
        Logger.error(error);
      }
    }
  }

  private async _verifyMode(owner: User): Promise<void> {
    if (owner.setup && owner.setup?.mode) {
      await this._modeService.setMode(owner.setup.mode, owner.id, true);
    }
  }

  private async _verifyCloudScheduledTask(owner: User): Promise<void> {
    const cloudPreferences: CloudPreferences = owner.cloudPreferences;
    if (cloudPreferences.isEverydayWaterHeatOn) {
      this._schedulerRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).start();
      this._schedulerRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).start();
      Logger.log('Scheduling everyday water heating');
    }
  }

  private async _verifyScheduleHeating(owner: User): Promise<void> {
    const dateToStartHeating: Date | null = owner.cloudPreferences.dateToStartHeating;
    const dateToTurnOffHeating: Date | null = owner.cloudPreferences.dateToTurnOffHeating;

    if (dateToStartHeating && dateToTurnOffHeating) {
      Logger.log('Setting scheduled heating');

      const now: Date = new Date();

      if (now < dateToStartHeating) {
        scheduleHeatOn({
          date: dateToStartHeating,
          userId: owner.id,
          schedulerRegistry: this._schedulerRegistry,
          userService: this._userService,
          cloudService: this._cloudService,
        });

        scheduleHeatOff({
          date: dateToTurnOffHeating,
          userId: owner.id,
          schedulerRegistry: this._schedulerRegistry,
          userService: this._userService,
          cloudService: this._cloudService,
        });
      }

      if (now > dateToStartHeating && now < dateToTurnOffHeating) {
        scheduleHeatOff({
          date: dateToTurnOffHeating,
          userId: owner.id,
          schedulerRegistry: this._schedulerRegistry,
          userService: this._userService,
          cloudService: this._cloudService,
        });
      }
    } else {
      Logger.log('No heating found for scheduling');
    }
  }
}
