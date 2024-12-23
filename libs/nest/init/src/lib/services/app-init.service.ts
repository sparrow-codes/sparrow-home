import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, User, UserRole } from '@sparrow-server/entities';
import { CronJobName } from '@sparrow-server/shared';
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

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
