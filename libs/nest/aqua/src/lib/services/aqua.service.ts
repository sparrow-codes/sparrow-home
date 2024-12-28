import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, TuyaDevice, TuyaDeviceType, User, UserRole } from '@sparrow-server/entities';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { CronTime } from 'cron/dist/time';
import { Repository } from 'typeorm';

import { GetAquaPreferences } from '../controllers/models/get-aqua-preferences';
import { SetAquaPreferencesRequest } from '../controllers/models/set-aqua-preferences-request';

@Injectable()
export class AquaService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(TuyaDevice) private readonly _tuyaDeviceRepository: Repository<TuyaDevice>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {}

  public async getAquaPreferences(): Promise<GetAquaPreferences> {
    const user: User = await this._getUser();
    return {
      lightStartTime: user.aquaPreferences.lightStartTime,
      lightEndTime: user.aquaPreferences.lightEndTime,
      tuyaDeviceId: user.aquaPreferences.tuyaDevice?.tuyaDeviceId,
      isActive: user.aquaPreferences.isActive ?? false,
    };
  }

  public async setLightJobStatusLightJob(isActive: boolean): Promise<void> {
    const user: User = await this._getUser();
    const aquaPreferences: AquaPreferences = user.aquaPreferences;
    aquaPreferences.isActive = isActive;
    await this._aquaPreferencesRepository.save(aquaPreferences);
    this.setAquaLightJob(aquaPreferences);
  }

  public async setAquaPreferences(request: SetAquaPreferencesRequest): Promise<void> {
    const user: User = await this._getUser();
    const aquaPreferences: AquaPreferences = user.aquaPreferences;

    if (request.tuyaDeviceId && request.from && request.to) {
      const tuyaDevice: TuyaDevice | null = await this._tuyaDeviceRepository.findOneBy({
        tuyaDeviceId: request.tuyaDeviceId,
      });

      if (!tuyaDevice || tuyaDevice.deviceType !== TuyaDeviceType.LSC_POWER_PLUG) {
        throw new HttpException(
          `Invalid device type or missing device for id: ${request.tuyaDeviceId}`,
          HttpStatus.NOT_FOUND
        );
      }

      const aquaPreferences: AquaPreferences = user.aquaPreferences;

      aquaPreferences.tuyaDevice = tuyaDevice;
      aquaPreferences.lightStartTime = request.from;
      aquaPreferences.lightEndTime = request.to;
      this.setAquaLightJob(user.aquaPreferences);
    } else {
      aquaPreferences.tuyaDevice = undefined;
      aquaPreferences.lightStartTime = undefined;
      aquaPreferences.lightEndTime = undefined;

      const cronJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
      cronJob.stop();
    }

    await this._aquaPreferencesRepository.save(aquaPreferences);
  }

  public setAquaLightJob(aquaPreferences: AquaPreferences): void {
    const cronJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
    if (aquaPreferences.isActive) {
      const hours: number | undefined = aquaPreferences.lightStartTime?.getHours();
      const minutes: number | undefined = aquaPreferences.lightStartTime?.getMinutes();

      if (minutes === undefined || hours === undefined) {
        throw new HttpException('Invalid Aqua parameters configuration', HttpStatus.CONFLICT);
      }

      cronJob.setTime(new CronTime(`0 ${minutes} ${hours} * * *`));
      Logger.log(`Setting Aqua light job - next run will be at: ${cronJob.nextDate()}`);
      cronJob.start();
    } else {
      cronJob.stop();
      Logger.log('Aqua light job Stopped.');
    }
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
