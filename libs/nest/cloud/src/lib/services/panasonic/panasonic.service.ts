import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudPreferences, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import { ComfortCloudConnector, HeatPump, ZigbeeSensorService } from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { combineLatest, debounceTime, filter, first, firstValueFrom, from, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { SetHeatPumpStatusRequest } from '../../controllers/models/panasonic/set-heat-pump-status.request';

@Injectable()
export class PanasonicService {
  public constructor(
    private readonly _connector: ComfortCloudConnector,
    private readonly _scheduleRegistry: SchedulerRegistry,
    private readonly _zigbeeSensorService: ZigbeeSensorService,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {
    combineLatest([this.getHeatPumpDetails(), this._getUser()])
      .pipe(
        first(),
        filter(([, user]) => Boolean(user)),
        switchMap(([heatPump, user]) => {
          const cloudPreferences: CloudPreferences = user!.cloudPreferences;
          cloudPreferences.isHeatOn = !!heatPump.zoneStatus[0].operationStatus;
          return this._cloudPreferencesRepository.save(cloudPreferences);
        })
      )
      .subscribe();

    this._zigbeeSensorService.sensorDetails$
      .pipe(
        debounceTime(10000),
        switchMap((deviceDetails) => {
          return combineLatest([of(deviceDetails), from(this._getUser())]);
        }),
        filter(([, user]) => Boolean(user)),
        filter(
          ([device, user]) =>
            device.deviceId === user!.cloudPreferences.firstFlorTemperatureSensorZigbeeId ||
            device.deviceId === user!.cloudPreferences.groundFlorTemperatureSensorZigbeeId
        ),
        filter(([, user]) => user!.cloudPreferences.isAutomaticHeat)
      )
      .subscribe(([, user]) => this._verifyTemperatureFromSensors(user!));
  }

  public getHeatPumpDetails(): Observable<HeatPump> {
    return this._connector.getDeviceDetails();
  }

  public async scheduledWaterHeating(active: boolean): Promise<void> {
    const user: User | null = await this._getUser();
    if (!user) {
      return;
    }
    const cloudPreferences: CloudPreferences = user.cloudPreferences;
    if (active) {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).start();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).start();
      cloudPreferences.isEverydayWaterHeatOn = true;
      Logger.log('Scheduling everyday water heating');
    } else {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).stop();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).stop();
      cloudPreferences.isEverydayWaterHeatOn = false;
      Logger.log('Setting off everyday water heating');
    }

    await this._cloudPreferencesRepository.save(cloudPreferences);
  }

  public isScheduledWaterHeating(): boolean {
    return (
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).running &&
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).running
    );
  }

  public async setHeatOnly(isHeatOn: boolean): Promise<void> {
    const user: User | null = await this._getUser();
    if (!user) {
      return;
    }

    const cloudPreferences: CloudPreferences = user.cloudPreferences;

    if (user.cloudPreferences.isHeatOn === isHeatOn) {
      Logger.log('Heat status is already in desired state based on DB');
      return;
    }

    cloudPreferences.isHeatOn = isHeatOn;
    await this._cloudPreferencesRepository.save(cloudPreferences);

    const heatPump: HeatPump = await firstValueFrom(this._connector.getDeviceDetails());
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
    const heatPump: HeatPump = await firstValueFrom(this._connector.getDeviceDetails());
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
    await firstValueFrom(this._connector.setDeviceStatus(request.isWaterOn, request.isHeatOn));
  }

  private async _verifyTemperatureFromSensors(user: User): Promise<void> {
    const cloudPreferences: CloudPreferences = user.cloudPreferences;
    const minTargetTemperature: number | null = cloudPreferences.minTargetTemperature;
    const maxTargetTemperature: number | null = cloudPreferences.maxTargetTemperature;

    if (minTargetTemperature !== null && maxTargetTemperature !== null && cloudPreferences.isAutomaticHeat) {
      const listOfTemperatures: number[] = await this.getListOfCurrentTemperatures(cloudPreferences);

      Logger.log(`Temperature on sensors: ${JSON.stringify(listOfTemperatures)}`);

      if (listOfTemperatures.find((temp) => temp < minTargetTemperature)) {
        Logger.log('Temperature is lower than on one of the sensors - turning heat on');
        await this.setHeatOnly(true);
        return;
      }

      if (listOfTemperatures.every((temp) => temp >= maxTargetTemperature)) {
        Logger.log('Temperature reached its destination - turning heat off');
        await this.setHeatOnly(false);
      }
    }
  }

  private async _getUser(): Promise<User | null> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    return user;
  }

  private async getListOfCurrentTemperatures(cloudPreferences: CloudPreferences): Promise<number[]> {
    const groundFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId: cloudPreferences.groundFlorTemperatureSensorZigbeeId ?? undefined,
    });
    const firstFlorSensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId: cloudPreferences.firstFlorTemperatureSensorZigbeeId ?? undefined,
    });

    const listOfTemperatures: number[] = [];

    if (groundFlorSensor?.temperature) {
      listOfTemperatures.push(groundFlorSensor.temperature);
    }

    if (firstFlorSensor?.temperature) {
      listOfTemperatures.push(firstFlorSensor.temperature);
    }

    return listOfTemperatures;
  }
}
