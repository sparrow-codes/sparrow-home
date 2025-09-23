import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import {
  DeviceResponse,
  OpenDoorSensorDetails,
  SensorDetails,
  SonoffTemperatureSensorDetails,
  ZigbeeManageDeviceService,
  ZigbeePetFeederService,
  ZigbeeSensorService,
  ZigbeeSwitchMqttService,
} from '@sparrow-server/external-api';
import { first, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { IsNull, Not, Repository } from 'typeorm';

import { GetAllDeviceFilters } from '../../controllers/models/get-all-device-filters';
import { DeviceDetailsMapper } from '../../mappers/device-details-mapper';
import { HomeDeviceDetailsDto } from '../../models/home-device-details-dto';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _zigbeeManageDeviceService: ZigbeeManageDeviceService,
    private readonly _zigbeeSensorService: ZigbeeSensorService,
    private readonly _zigbeePetFeederService: ZigbeePetFeederService
  ) {
    this._subscribeToSensors();
    this._zigbeeSensorService.sensorDetails$.subscribe((response) => this.handleSensorEvent(response));
  }

  public getListOfDevices(filters?: GetAllDeviceFilters): Observable<HomeDeviceDetailsDto[]> {
    return from(
      this._homeDeviceRepository.findBy({
        deviceType: filters?.deviceType,
        isOpen: filters?.isOpen,
        task:
          filters?.withTaskAssigned === true
            ? Not(IsNull())
            : filters?.withTaskAssigned === false
            ? IsNull()
            : undefined,
      })
    ).pipe(
      first(),
      switchMap((entities) => {
        if (!entities.length) {
          return of([]);
        }

        return forkJoin(
          entities.map((entity) => {
            switch (entity.deviceType) {
              case DeviceType.POWER_PLUG:
                return this._zigbeeSwitchMqttService
                  .getSwitchStatus(entity.zigbeeDeviceId)
                  .pipe(map((status) => DeviceDetailsMapper.getSwitchDetails(entity, status)));

              case DeviceType.SONOFF_TEMPERATURE_SENSOR:
                return of(DeviceDetailsMapper.getTemperatureSensorDetails(entity));

              case DeviceType.OPEN_DOOR_SENSOR:
                return of(DeviceDetailsMapper.getOpenDoorSensorDetails(entity));

              case DeviceType.SIREN:
                return of(DeviceDetailsMapper.getSirenDetailsDto(entity));

              case DeviceType.PILOT:
                return of(DeviceDetailsMapper.getPilotDetailDto(entity));

              case DeviceType.PET_FEEDER:
                return of(DeviceDetailsMapper.toPetFeederDetailsDto(entity));

              default:
                Logger.error(`Unsupported device type for device ${entity.deviceName}`);
                return of(null);
            }
          })
        ).pipe(map((details) => details.filter((d): d is HomeDeviceDetailsDto => !!d)));
      })
    );
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

        if (device.deviceType === DeviceType.PET_FEEDER) {
          device.feederNumberOfPortions = 1;
          device.feederPortionSize = 10;
        }

        return from(this._homeDeviceRepository.save(device)).pipe(
          tap(() => this._subscribeToSensors()),
          map(() => true)
        );
      })
    );
  }

  public async changeDeviceName(id: number, deviceName: string): Promise<void> {
    const device: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!device) {
      throw new NotFoundException(`Device ${id} not found`);
    }

    device.deviceName = deviceName;
    await this._homeDeviceRepository.save(device);
  }

  public async removeDevice(id: number): Promise<void> {
    const homDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!homDevice) {
      return;
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
          case DeviceType.PILOT:
            return of(DeviceDetailsMapper.getPilotDetailDto(entity));
          case DeviceType.PET_FEEDER:
            return of(DeviceDetailsMapper.toPetFeederDetailsDto(entity));
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

  public async getAvgTemperature(): Promise<number | null> {
    const temperatureSensors: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.SONOFF_TEMPERATURE_SENSOR,
    });

    if (temperatureSensors.length === 0) {
      return null;
    }

    const validTemperatures: number[] = temperatureSensors
      .map((device) => device.temperature)
      .filter((value) => value !== null);

    if (validTemperatures.length === 0) {
      return null;
    }

    const avg: number = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;

    return Math.round(avg * 10) / 10;
  }

  public async areAllDoorsAndWindowsClosed(): Promise<boolean | null> {
    const openSensors: HomeDevice[] = await this._homeDeviceRepository.findBy({
      deviceType: DeviceType.OPEN_DOOR_SENSOR,
    });

    if (!openSensors.length) {
      return null;
    }

    return openSensors.every((sensor) => !sensor.isOpen);
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

    const pilots: HomeDevice[] = await this._homeDeviceRepository.findBy({ deviceType: DeviceType.PILOT });

    const sensorDevices: HomeDevice[] = [...temperatureSensors, ...openDoorSensors, ...sirens, ...pilots];

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
