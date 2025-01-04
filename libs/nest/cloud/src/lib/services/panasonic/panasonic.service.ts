import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '@sparrow-server/entities';
import { ConfigKey, CronJobName } from '@sparrow-server/shared';
import { first, firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';
import { SetHeatPumpStatusRequest } from '../../controllers/models/panasonic/set-heat-pump-status.request';
import { HeatPump } from '../../models/panasonic-cloud-models';

@Injectable()
export class PanasonicService {
  public constructor(
    private readonly _connector: ComfortCloudConnector,
    private readonly _configService: ConfigService,
    private readonly _scheduleRegistry: SchedulerRegistry,
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {}

  public getHeatPumpDetails(): Observable<HeatPump> {
    return from(this._connectToPanasonicCloud()).pipe(
      first(),
      switchMap(() => this._connector.getDeviceDetails())
    );
  }

  public async scheduledWaterHeating(active: boolean): Promise<void> {
    const user: User = await this._getUser();
    if (active) {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).start();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).start();
      user.cloudPreferences.isEverydayWaterHeatOn = true;
      Logger.log('Scheduling everyday water heating');
    } else {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).stop();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).stop();
      user.cloudPreferences.isEverydayWaterHeatOn = false;
      Logger.log('Setting off everyday water heating');
    }

    await this._userRepository.save(user);
  }

  public isScheduledWaterHeating(): boolean {
    return (
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).running &&
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).running
    );
  }

  public async setHeatOnly(isHeatOn: boolean): Promise<void> {
    await this._connectToPanasonicCloud();
    const heatPump: HeatPump = await this._connector.getDeviceDetails();
    const isWaterOn: boolean = heatPump.tankStatus[0].operationStatus === 1;
    const isHeatCurrentlyOn: boolean = heatPump.zoneStatus[0].operationStatus === 1;
    if (isHeatCurrentlyOn !== isHeatOn) {
      await this.setHeatPumpOperationMode({ isWaterOn, isHeatOn, deviceGuid: heatPump.deviceGuid });
      Logger.log(`Setting heat: ${isHeatOn ? 'ON' : 'OFF'}`);
    } else {
      Logger.log('Heat status is already in desired state');
    }
  }

  public async setWaterOnly(isWaterOn: boolean): Promise<void> {
    await this._connectToPanasonicCloud();
    const heatPump: HeatPump = await this._connector.getDeviceDetails();
    const isWaterOnCurrently: boolean = heatPump.tankStatus[0].operationStatus === 1;
    const isHeatOn: boolean = heatPump.zoneStatus[0].operationStatus === 1;
    if (isWaterOnCurrently !== isWaterOn) {
      await this.setHeatPumpOperationMode({ isWaterOn, isHeatOn, deviceGuid: heatPump.deviceGuid });
      Logger.log(`Setting water: ${isWaterOn ? 'ON' : 'OFF'}`);
    } else {
      Logger.log('Water status is already in desired state');
    }
  }

  public async setHeatPumpOperationMode(request: SetHeatPumpStatusRequest): Promise<void> {
    await this._connectToPanasonicCloud();
    await firstValueFrom(this._connector.setDeviceStatus(request.isWaterOn, request.isHeatOn, request.deviceGuid));
  }

  private async _connectToPanasonicCloud(): Promise<void> {
    const userName: string | undefined = this._configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string | undefined = this._configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return this._connector.login(userName, password);
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
