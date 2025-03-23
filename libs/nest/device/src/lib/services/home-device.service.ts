import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, CloudPreferences, DeviceType, HomeDevice, User, UserRole } from '@sparrow-server/entities';
import {
  DeviceResponse,
  OpenDoorSensorDetails,
  SensorDetails,
  SonoffTemperatureSensorDetails,
  ZigbeeManageDeviceService,
  ZigbeeSensorService,
  ZigbeeSwitchMqttService,
} from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { first, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';

import { DeviceDetailsMapper } from '../mappers/device-details-mapper';
import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceDto } from '../models/home-device-dto';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _zigbeeManageDeviceService: ZigbeeManageDeviceService,
    private readonly _zigbeeSensorService: ZigbeeSensorService,
    private readonly scheduledRegistry: SchedulerRegistry
  ) {
    this._subscribeToSensors();
    this._zigbeeSensorService.sensorDetails$.subscribe((response) => this.handleSensorEvent(response));
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
            return this._zigbeeSwitchMqttService
              .getSwitchStatus(entity.zigbeeDeviceId)
              .pipe(map((response) => DeviceDetailsMapper.getSwitchDetails(entity, response)));
          case DeviceType.SONOFF_TEMPERATURE_SENSOR:
            return of(DeviceDetailsMapper.getTemperatureSensorDetails(entity));
          case DeviceType.OPEN_DOOR_SENSOR:
            return of(DeviceDetailsMapper.getOpenDoorSensorDetails(entity));
          case DeviceType.SIREN:
            return of(DeviceDetailsMapper.getSirenDetailsDto(entity));
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
    const temperatureSensors: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.SONOFF_TEMPERATURE_SENSOR,
    });

    const openDoorSensors: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.OPEN_DOOR_SENSOR,
    });

    const sirens: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.SIREN,
    });

    const sensorDevices: HomeDevice[] = [...temperatureSensors, ...openDoorSensors, ...sirens];

    this._zigbeeSensorService.clearListeners(sensorDevices.map((device) => device.zigbeeDeviceId));
    sensorDevices.forEach((device: HomeDevice) => {
      Logger.log(`Subscribing to ${device.deviceName}`);
      this._zigbeeSensorService.subscribeToSensor(device.zigbeeDeviceId);
    });
  }

  private async handleSensorEvent(response: DeviceResponse<SensorDetails>): Promise<void> {
    const sensor: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: response.deviceId });
    Logger.log(response, 'Sensor Message');

    if (!sensor) {
      Logger.warn(`Event from unsupported device. ID: ${response.deviceId}`);
      return;
    }

    if (sensor.deviceType === DeviceType.SONOFF_TEMPERATURE_SENSOR) {
      sensor.temperature = (response.payload as SonoffTemperatureSensorDetails).temperature;
    }

    if (sensor.deviceType === DeviceType.OPEN_DOOR_SENSOR) {
      sensor.isOpen = !(response.payload as OpenDoorSensorDetails).contact;

      if (sensor.isOpen) {
        sensor.lastOpened = new Date();
      }
    }

    sensor.signalStrength = response.payload.linkquality;
    sensor.battery = response.payload.battery;

    await this._homeDeviceRepository.save(sensor);
  }
}
