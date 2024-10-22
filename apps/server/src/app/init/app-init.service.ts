import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CloudPreferences } from '../entities/cloud-preferences';
import { User } from '../entities/user';
import { CronJobName } from '../enums/cron-job-name';
import { ModeService } from '../modules/setup/services/mode/mode.service';
import { UserRole } from '../modules/user/enum/user-role';
import { UserService } from '../modules/user/services/user.service';

@Injectable()
export class AppInitService {
  public constructor(
    private readonly _userService: UserService,
    private readonly _modeService: ModeService,
    private readonly _schedulerRegistry: SchedulerRegistry
  ) {}

  public async onInit(): Promise<void> {
    Logger.log('Verifying application configuration');
    try {
      const owner: User = await this._userService.getUserByRole(UserRole.OWNER);
      await this._verifyMode(owner);
      await this._verifyCloudScheduledTask(owner);
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
}
