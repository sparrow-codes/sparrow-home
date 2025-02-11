import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, CloudPreferences, User, UserRole } from '@sparrow-server/entities';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { CronTime } from 'cron/dist/time';
import { Repository } from 'typeorm';

@Injectable()
export class AppInitService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _schedulerRegistry: SchedulerRegistry
  ) {}

  public async onInit(): Promise<void> {
    Logger.log('Verifying application configuration');

    try {
      const owner: User = await this._getUser();
      await this._verifyCloudScheduledTask(owner);
      await this._verifyAquaPreferences(owner);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        Logger.log('No user found. Initial configuration required');
      } else {
        Logger.error(error);
      }
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

  private async _verifyAquaPreferences(owner: User): Promise<void> {
    const aquaPreferences: AquaPreferences = owner.aquaPreferences;
    const startTime: Date | null = aquaPreferences.lightStartTime;
    const endTime: Date | null = aquaPreferences.lightEndTime;

    if (aquaPreferences.isActive && startTime && endTime && aquaPreferences.homeDevice) {
      const aquaLightStartJob: CronJob = this._schedulerRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
      const aquaLightEndJob: CronJob = this._schedulerRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT_OFF);

      aquaLightStartJob.setTime(new CronTime(`0 ${startTime.getMinutes()} ${startTime.getHours()} * * *`));
      aquaLightEndJob.setTime(new CronTime(`0 ${endTime.getMinutes()} ${endTime.getHours()} * * *`));

      aquaLightStartJob.start();
      aquaLightEndJob.start();

      Logger.log(`Starting everyday aqua start light: start at ${aquaLightStartJob.nextDate()}`);
      Logger.log(`Starting everyday aqua end light: start at ${aquaLightEndJob.nextDate()}`);
    }
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
