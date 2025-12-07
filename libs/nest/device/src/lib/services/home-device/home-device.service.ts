import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ActionJob, DeviceType, HomeDevice } from '@sparrow-server/entities';
import { DeviceProfile, ZigbeeDeviceService, ZigbeeManageDeviceService } from '@sparrow-server/external-api';
import { first, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { DataSource, Repository } from 'typeorm';

import { GetAllDeviceFilters } from '../../controllers/models/get-all-device-filters';
import { SetDeviceSettingsRequest } from '../../controllers/models/set-device-settings-request';
import { DeviceDetailsMapper } from '../../mappers/device-details-mapper';
import { HomeDeviceDetailsDto } from '../../models/home-device-details-dto';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly _zigbeeManageDeviceService: ZigbeeManageDeviceService,
    private readonly _zigbeeDeviceService: ZigbeeDeviceService
  ) {}

  public async setDeviceSettings(id: number, request: SetDeviceSettingsRequest): Promise<void> {
    const device: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!device) {
      throw new NotFoundException(`Device ${id} not found`);
    }

    device.mainActionKey = request.mainActionKey ?? null;
    device.mainParamKey = request.mainParamKey ?? null;
    device.isOnMainPage = Boolean(request.isOnMainPage);

    await this._homeDeviceRepository.save(device);
  }

  public publishEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._zigbeeDeviceService.publishEvent(deviceId, JSON.stringify(payload));
  }

  public getListOfDevices(filters?: GetAllDeviceFilters): Observable<HomeDeviceDetailsDto[]> {
    return from(
      this._homeDeviceRepository.findBy({
        deviceType: filters?.deviceType,
        isOnMainPage: filters?.isOnMainPage,
      })
    ).pipe(
      map((entities) => {
        if (filters?.isOpen !== undefined) {
          return entities.filter(
            (entity) =>
              this._zigbeeDeviceService.devices.get(entity.zigbeeDeviceId)?.state['contact'] === !filters.isOpen
          );
        }

        return entities;
      }),
      first(),
      switchMap((entities) => {
        if (!entities.length) {
          return of([]);
        }

        return forkJoin(
          entities.map((entity) => {
            const deviceProfile: DeviceProfile = this._zigbeeDeviceService.devices.get(
              entity.zigbeeDeviceId
            ) as DeviceProfile;

            return of(DeviceDetailsMapper.toDeviceDetails(entity, deviceProfile));
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

        return from(this._homeDeviceRepository.save(device)).pipe(map(() => true));
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
    const homeDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!homeDevice) {
      return;
    }

    await this._homeDeviceRepository
      .delete({ id })
      .then(() => this._zigbeeDeviceService.removeDevice(homeDevice.zigbeeDeviceId));

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ActionJob)
      .where('assignedDeviceId = :assignedDeviceId', { assignedDeviceId: homeDevice.zigbeeDeviceId })
      .execute();
  }

  public getDeviceDetails(id: number): Observable<HomeDeviceDetailsDto | null> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        const deviceProfile: DeviceProfile = this._zigbeeDeviceService.devices.get(
          entity.zigbeeDeviceId
        ) as DeviceProfile;

        return of(DeviceDetailsMapper.toDeviceDetails(entity, deviceProfile));
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
      .map((device) => {
        const deviceProfile: DeviceProfile = this._zigbeeDeviceService.devices.get(
          device.zigbeeDeviceId
        ) as DeviceProfile;

        return deviceProfile.state['temperature'] as number;
      })
      .filter((value) => value !== null);

    if (validTemperatures.length === 0) {
      return null;
    }

    const avg: number = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;

    return Math.round(avg * 10) / 10;
  }

  public async areAllDoorsAndWindowsClosed(): Promise<boolean | null> {
    const openSensors: DeviceProfile[] = (
      await this._homeDeviceRepository.findBy({
        deviceType: DeviceType.OPEN_DOOR_SENSOR,
      })
    ).map((device) => this._zigbeeDeviceService.devices.get(device.zigbeeDeviceId) as DeviceProfile);

    if (openSensors.length === 0) {
      return null;
    }

    return openSensors.every((sensor) => sensor.state['contact'] === true);
  }
}
