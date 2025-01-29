import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, CloudPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import {
  DeviceResponse,
  SonoffTemperatureSensorDetails,
  ZigbeeManageDeviceService,
  ZigbeeSwitchMqttService,
  ZigbeeTemperatureSensorService,
} from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { first, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceDto } from '../models/home-device-dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { TemperatureSensorDetailsDto } from '../models/temperature-sensor-details-dto';
import { calculatePercentage } from '../utils/calculate-percentage';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _zigbeeManageDeviceService: ZigbeeManageDeviceService,
    private readonly _zigbeeTemperatureSensorService: ZigbeeTemperatureSensorService,
    private readonly scheduledRegistry: SchedulerRegistry
  ) {
    this._subscribeToSensors();
    this._zigbeeTemperatureSensorService.sonoffTemperatureSensorDetails$.subscribe((response) =>
      this.handleTemperatureSensorEvent(response)
    );
  }

  public async getListOfDevices(): Promise<HomeDeviceDto[]> {
    const devices: HomeDevice[] = await this._homeDeviceRepository.find();
    return devices.map(this._toDeviceDto);
  }

  public addDevice(type: DeviceType, name: string): Observable<boolean> {
    return this._zigbeeManageDeviceService.joinDeviceAndSetId().pipe(
      first(),
      switchMap((zigbeeDeviceId) => {
        if (!zigbeeDeviceId) {
          return of(false);
        }

        const device: HomeDevice = new HomeDevice();
        device.deviceType = type;
        device.zigbeeDeviceId = zigbeeDeviceId;
        device.deviceName = name;

        return from(this._homeDeviceRepository.save(device)).pipe(
          tap(() => this._subscribeToSensors()),
          map(() => true)
        );
      })
    );
  }

  public async removeDevice(id: number): Promise<void> {
    const homDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!homDevice) {
      return;
    }

    const user: User = await this._getUser();
    const aquaPreferences: AquaPreferences = user.aquaPreferences;
    const cloudPreferences: CloudPreferences = user.cloudPreferences;

    if (aquaPreferences.homeDevice?.id === homDevice.id) {
      aquaPreferences.homeDevice = null;
      aquaPreferences.isActive = false;
      await this._aquaPreferencesRepository.save(aquaPreferences);
      this.scheduledRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT).stop();
    }

    if (cloudPreferences.homeDevice?.id === homDevice.id) {
      cloudPreferences.homeDevice = null;
      cloudPreferences.isCircularPumpActive = false;
      await this._cloudPreferencesRepository.save(cloudPreferences);
      this.scheduledRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT).stop();
    }

    await this._zigbeeManageDeviceService.removeDevice(homDevice.zigbeeDeviceId);
    await this._homeDeviceRepository.delete({ id });
    await this._subscribeToSensors();
  }

  public getDeviceDetails(id: number): Observable<HomeDeviceDetailsDto | null> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        switch (entity.deviceType) {
          case DeviceType.POWER_PLUG:
            return this._getSwitchStatus(entity);
          case DeviceType.SONOFF_TEMPERATURE_SENSOR:
            return this._getTemperatureSensorDetails(entity);
          default:
            Logger.error(`Unsupported device type for device ${entity.deviceName}`);
            return of(null);
        }
      })
    );
  }

  public setPluginSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        return this._zigbeeSwitchMqttService.setSwitchOn(entity.zigbeeDeviceId, isOn);
      })
    );
  }

  private _getSwitchStatus(entity: HomeDevice): Observable<PluginSwitchDetailsDto> {
    return this._zigbeeSwitchMqttService.getSwitchStatus(entity.zigbeeDeviceId).pipe(
      map((response) => ({
        type: DeviceType.POWER_PLUG,
        name: entity.deviceName,
        homeDeviceId: entity.zigbeeDeviceId,
        id: entity.id,
        isOnline: !!(response && response.payload.linkquality > 0),
        isOn: !!(response && response?.payload.state === 'ON'),
        signalStrength: response ? calculatePercentage(0, 255, response.payload.linkquality) : 0,
      }))
    );
  }

  private _getTemperatureSensorDetails(entity: HomeDevice): Observable<TemperatureSensorDetailsDto> {
    return of({
      type: entity.deviceType,
      homeDeviceId: entity.zigbeeDeviceId,
      name: entity.deviceName,
      temperature: entity.temperature != null ? entity.temperature : undefined,
      signalStrength: entity.signalStrength ? calculatePercentage(0, 255, entity.signalStrength) : 0,
      isOnline: !!entity.signalStrength && entity.signalStrength > 0,
      battery: entity.battery !== null ? entity.battery : undefined,
      id: entity.id,
    });
  }

  private _toDeviceDto(device: HomeDevice): HomeDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      homeDeviceId: device.zigbeeDeviceId,
    };
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return user;
  }

  private async _subscribeToSensors(): Promise<void> {
    const sensorDevices: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.SONOFF_TEMPERATURE_SENSOR,
    });

    this._zigbeeTemperatureSensorService.clearListeners(sensorDevices.map((device) => device.zigbeeDeviceId));
    sensorDevices.forEach((device: HomeDevice) => {
      Logger.log(`Subscribing to ${device.deviceName}`);
      this._zigbeeTemperatureSensorService.subscribeToTemperatureSensor(device.zigbeeDeviceId);
    });
  }

  private async handleTemperatureSensorEvent(response: DeviceResponse<SonoffTemperatureSensorDetails>): Promise<void> {
    const sensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: response.deviceId });

    if (!sensor) {
      Logger.warn(`Event from unsupported device. ID: ${response.deviceId}`);
      return;
    }

    sensor.temperature = response.payload.temperature;
    sensor.signalStrength = response.payload.linkquality;
    sensor.battery = response.payload.battery;

    await this._homeDeviceRepository.save(sensor);
  }
}
