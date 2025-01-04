import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, TuyaDevice, TuyaDeviceType, User, UserRole } from '@sparrow-server/entities';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { CronTime } from 'cron/dist/time';
import { Repository } from 'typeorm';

import { GetCircularPumpPreferences } from '../../controllers/models/circular-pump/get-circular-pump-preferences';
import { SetCircularPumpPreferencesRequest } from '../../controllers/models/circular-pump/set-circular-pump-preferences-request';

@Injectable()
export class CircularPumpService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    @InjectRepository(TuyaDevice) private readonly _tuyaDeviceRepository: Repository<TuyaDevice>,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {}

  public async getCircularPumpPreferences(): Promise<GetCircularPumpPreferences> {
    const user: User = await this._getUser();
    const response: GetCircularPumpPreferences = new GetCircularPumpPreferences();
    response.tuyaDeviceId = user.cloudPreferences.tuyaDevice?.tuyaDeviceId;
    response.isActive = user.cloudPreferences.isCircularPumpActive ?? false;

    if (user.cloudPreferences.circularPumpEndTime) {
      response.circularPumpEndTime = user.cloudPreferences.circularPumpEndTime;
    }

    if (user.cloudPreferences.circularPumpStartTime) {
      response.circularPumpStartTime = user.cloudPreferences.circularPumpStartTime;
    }

    return response;
  }

  public async setCircularPumpScheduleTask(isActive: boolean): Promise<void> {
    const user: User = await this._getUser();
    const cloudPreferences: CloudPreferences = user.cloudPreferences;
    cloudPreferences.isCircularPumpActive = isActive;
    await this._cloudPreferencesRepository.save(cloudPreferences);
    this.setCircularPumpJob(cloudPreferences);
  }

  public async setCircularPumpPreferences(request: SetCircularPumpPreferencesRequest): Promise<void> {
    const user: User = await this._getUser();
    const cloudPreferences: CloudPreferences = user.cloudPreferences;

    cloudPreferences.circularPumpStartTime = request.from ?? null;
    cloudPreferences.circularPumpEndTime = request.to ?? null;

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

      cloudPreferences.tuyaDevice = tuyaDevice;
      this.setCircularPumpJob(user.cloudPreferences);
    } else {
      cloudPreferences.tuyaDevice = null;

      const cronJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP);
      cronJob.stop();
      Logger.log('Circular pump job Stopped.');
    }

    await this._cloudPreferencesRepository.save(cloudPreferences);
  }

  public setCircularPumpJob(cloudPreferences: CloudPreferences): void {
    const cronJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP);
    if (cloudPreferences.isCircularPumpActive) {
      const hours: number | undefined = cloudPreferences.circularPumpStartTime?.getHours();
      const minutes: number | undefined = cloudPreferences.circularPumpEndTime?.getMinutes();

      if (minutes === undefined || hours === undefined) {
        throw new HttpException('Invalid Circular Pump parameters configuration', HttpStatus.CONFLICT);
      }

      cronJob.setTime(new CronTime(`0 ${minutes} ${hours} * * *`));
      Logger.log(`Setting Circular pump job - next run will be at: ${cronJob.nextDate()}`);
      cronJob.start();
    } else {
      cronJob.stop();
      Logger.log('Circular pump job Stopped.');
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
