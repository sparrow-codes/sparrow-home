import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
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
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {}

  public async getAquaPreferences(): Promise<GetAquaPreferences> {
    const user: User = await this._getUser();
    const response: GetAquaPreferences = new GetAquaPreferences();
    response.homeDeviceId = user.aquaPreferences.homeDevice?.zigbeeDeviceId;
    response.isActive = user.aquaPreferences.isActive ?? false;

    if (user.aquaPreferences.lightStartTime) {
      response.lightStartTime = user.aquaPreferences.lightStartTime;
    }

    if (user.aquaPreferences.lightEndTime) {
      response.lightEndTime = user.aquaPreferences.lightEndTime;
    }

    return response;
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

    aquaPreferences.lightStartTime = request.from ? new Date(request.from) : null;
    aquaPreferences.lightEndTime = request.to ? new Date(request.to) : null;

    if (request.homeDeviceId && request.from && request.to) {
      const homeDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
        zigbeeDeviceId: request.homeDeviceId,
      });

      if (!homeDevice || homeDevice.deviceType !== DeviceType.POWER_PLUG) {
        throw new HttpException(
          `Invalid device type or missing device for id: ${request.homeDeviceId}`,
          HttpStatus.NOT_FOUND
        );
      }

      const aquaPreferences: AquaPreferences = user.aquaPreferences;

      aquaPreferences.homeDevice = homeDevice;
      this.setAquaLightJob(user.aquaPreferences);
    } else {
      aquaPreferences.homeDevice = null;

      const cronJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
      cronJob.stop();
      Logger.log('Aqua light job Stopped.');
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
