import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { Repository } from 'typeorm';

import { GetCircularPumpPreferences } from '../../controllers/models/circular-pump/get-circular-pump-preferences';
import { SetCircularPumpPreferencesRequest } from '../../controllers/models/circular-pump/set-circular-pump-preferences-request';

@Injectable()
export class CircularPumpService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    private readonly _scheduleRegistry: SchedulerRegistry,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService
  ) {
    this._onInit();
  }

  public async getCircularPumpPreferences(): Promise<GetCircularPumpPreferences> {
    const user: User = await this._getUser();
    const response: GetCircularPumpPreferences = new GetCircularPumpPreferences();
    response.homeDeviceId = user.cloudPreferences.homeDevice?.zigbeeDeviceId;
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
    this._setCircularPumpJob(cloudPreferences);
  }

  public async setCircularPumpPreferences(request: SetCircularPumpPreferencesRequest): Promise<void> {
    const user: User = await this._getUser();
    const cloudPreferences: CloudPreferences = user.cloudPreferences;

    cloudPreferences.circularPumpStartTime = request.from ?? null;
    cloudPreferences.circularPumpEndTime = request.to ?? null;

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

      cloudPreferences.homeDevice = homeDevice;
      this._setCircularPumpJob(user.cloudPreferences);
    } else {
      cloudPreferences.homeDevice = null;
      this._stopCircularPumpJobs();
    }

    await this._cloudPreferencesRepository.save(cloudPreferences);
  }

  private async _onInit(): Promise<void> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    const cloudPreferences: CloudPreferences | undefined = user?.cloudPreferences;

    if (cloudPreferences) {
      this._setCircularPumpJob(cloudPreferences);
    }
  }

  private _setCircularPumpJob(cloudPreferences: CloudPreferences): void {
    if (cloudPreferences.isCircularPumpActive) {
      this._stopCircularPumpJobs();
      const startTime: Date | null = cloudPreferences.circularPumpStartTime;
      const endTime: Date | null = cloudPreferences.circularPumpEndTime;
      const zigbeeDeviceId: string | undefined = cloudPreferences.homeDevice?.zigbeeDeviceId;

      if (!startTime || !endTime || !zigbeeDeviceId) {
        throw new HttpException('Invalid Circular Pump parameters configuration', HttpStatus.CONFLICT);
      }

      const startCircularPumpJob: CronJob = new CronJob(
        `0 ${startTime.getMinutes()} ${startTime.getHours()} * * *`,
        () => this._everyDayCircularPumpOn(zigbeeDeviceId)
      );
      this._scheduleRegistry.addCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP, startCircularPumpJob);
      startCircularPumpJob.start();
      Logger.log(`Setting Circular pump start job - next run will be at: ${startCircularPumpJob.nextDate()}`);

      const endCircularPumpJob: CronJob = new CronJob(`0 ${endTime.getMinutes()} ${endTime.getHours()} * * *`, () =>
        this._everyDayCircularPumpOff(zigbeeDeviceId)
      );
      this._scheduleRegistry.addCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP_OFF, endCircularPumpJob);
      endCircularPumpJob.start();
      Logger.log(`Setting Circular pump stop job - next run will be at: ${endCircularPumpJob.nextDate()}`);
    } else {
      this._stopCircularPumpJobs();
    }
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async _everyDayCircularPumpOn(zigbeeDeviceId: string): Promise<void> {
    Logger.log('Starting scheduled task: Setting up water circular pump');
    this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, true);
  }

  private async _everyDayCircularPumpOff(zigbeeDeviceId: string): Promise<void> {
    Logger.log('Starting scheduled task: Setting down water circular pump');
    this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, false);

    const nextStartJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP);
    Logger.log(`Next circular pump will run at ${nextStartJob.nextDate()}`);
  }

  private _stopCircularPumpJobs(): void {
    if (this._scheduleRegistry.doesExist('cron', CronJobName.EVERY_DAY_CIRCULAR_PUMP)) {
      this._scheduleRegistry.deleteCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP);
    }

    if (this._scheduleRegistry.doesExist('cron', CronJobName.EVERY_DAY_CIRCULAR_PUMP_OFF)) {
      this._scheduleRegistry.deleteCronJob(CronJobName.EVERY_DAY_CIRCULAR_PUMP_OFF);
    }

    Logger.log('Circular pump job Stopped.');
  }
}
