import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { Repository } from 'typeorm';

import { GetAquaPreferences } from '../controllers/models/get-aqua-preferences';
import { SetAquaPreferences } from '../controllers/models/set-aqua-preferences';

@Injectable()
export class AquaService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {
    this._onInit();
  }

  public async getAquaPreferences(): Promise<GetAquaPreferences> {
    const user: User | null = await this._getUser();
    const response: GetAquaPreferences = new GetAquaPreferences();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

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
    const user: User | null = await this._getUser();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const aquaPreferences: AquaPreferences = user.aquaPreferences;
    aquaPreferences.isActive = isActive;
    await this._aquaPreferencesRepository.save(aquaPreferences);
    this._setAquaLightJob(aquaPreferences);
  }

  public async setAquaPreferences(request: SetAquaPreferences): Promise<void> {
    const user: User | null = await this._getUser();
    if (!user) {
      return;
    }

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
      this._setAquaLightJob(user.aquaPreferences);
    } else {
      aquaPreferences.homeDevice = null;
      this._stopAquaLightJobs();
    }

    await this._aquaPreferencesRepository.save(aquaPreferences);
  }

  private async _onInit(): Promise<void> {
    const user: User | null = await this._getUser();
    if (user) {
      const aquaPreferences: AquaPreferences = user.aquaPreferences;

      this._setAquaLightJob(aquaPreferences);
    }
  }

  private _setAquaLightJob(aquaPreferences: AquaPreferences): void {
    if (aquaPreferences.isActive) {
      this._stopAquaLightJobs();
      const lightStartTime: Date | null = aquaPreferences.lightStartTime;
      const lightEndTime: Date | null = aquaPreferences.lightEndTime;
      const zigbeeDeviceId: string | undefined = aquaPreferences.homeDevice?.zigbeeDeviceId;

      if (lightStartTime?.getMinutes() === undefined || lightStartTime.getHours() === undefined) {
        throw new HttpException('Invalid Aqua parameters configuration', HttpStatus.CONFLICT);
      }

      if (lightEndTime?.getMinutes() === undefined || lightEndTime.getHours() === undefined) {
        throw new HttpException('Invalid Aqua parameters configuration', HttpStatus.CONFLICT);
      }

      if (!zigbeeDeviceId) {
        throw new HttpException('Invalid Aqua parameters configuration', HttpStatus.CONFLICT);
      }

      const lightStartJob: CronJob = new CronJob(
        `0 ${lightStartTime.getMinutes()} ${lightStartTime.getHours()} * * *`,
        () => this._turnOnAquaLight(zigbeeDeviceId)
      );
      this._scheduleRegistry.addCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT, lightStartJob);
      lightStartJob.start();
      Logger.log(`Setting Aqua light job - next run will be at: ${lightStartJob.nextDate()}`);

      const lightEndJob: CronJob = new CronJob(`0 ${lightEndTime.getMinutes()} ${lightEndTime.getHours()} * * *`, () =>
        this._turnOffAquaLight(zigbeeDeviceId)
      );
      this._scheduleRegistry.addCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT_OFF, lightEndJob);
      lightEndJob.start();
      Logger.log(`Setting Aqua light stop job - next run will be at: ${lightEndJob.nextDate()}`);
    } else {
      this._stopAquaLightJobs();

      Logger.log('Aqua light scheduled tasks stopped');
    }
  }

  private async _getUser(): Promise<User | null> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });

    if (!user) {
      Logger.warn('No user found');
    }
    return user;
  }

  private _turnOnAquaLight(zigbeeDeviceId: string): void {
    Logger.log('Starting scheduled task: Every day aqua light on');
    this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, true);
  }

  private _turnOffAquaLight(zigbeeDeviceId: string): void {
    Logger.log('Starting scheduled task: Every day aqua light off');

    this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, false);
    const nextStartJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
    Logger.log(`Next aqua light will run at ${nextStartJob.nextDate()}`);
  }

  private _stopAquaLightJobs(): void {
    if (this._scheduleRegistry.doesExist('cron', CronJobName.EVERY_DAY_AQUA_LIGHT)) {
      this._scheduleRegistry.deleteCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
    }

    if (this._scheduleRegistry.doesExist('cron', CronJobName.EVERY_DAY_AQUA_LIGHT_OFF)) {
      this._scheduleRegistry.deleteCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT_OFF);
    }

    Logger.log('Aqua light job Stopped.');
  }
}
