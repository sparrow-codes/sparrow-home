import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { ZigbeeMqttService } from '@sparrow-server/external-api';
import { combineLatest, first, from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { HomeDeviceDto } from '../models/home-device-dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { calculatePercentage } from '../utils/calculate-percentage';

@Injectable()
export class HomeDeviceService {
  public constructor(
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    private readonly zigbeeMqttService: ZigbeeMqttService
  ) {}

  public async getListOfDevices(): Promise<HomeDeviceDto[]> {
    const devices: HomeDevice[] = await this._homeDeviceRepository.find();
    return devices.map(this._toDeviceDto);
  }

  public async addDevice(type: DeviceType, zigbeeDeviceId: string, name: string): Promise<void> {
    if (await this._homeDeviceRepository.findOneBy({ zigbeeDeviceId: zigbeeDeviceId })) {
      throw new ForbiddenException('Home Device already exists!');
    }

    const device: HomeDevice = new HomeDevice();
    device.deviceType = type;
    device.zigbeeDeviceId = zigbeeDeviceId;
    device.deviceName = name;
    await this._homeDeviceRepository.save(device);
  }

  public async removeDevice(id: number): Promise<void> {
    await this._homeDeviceRepository.delete({ id });
  }

  public getDeviceDetails(id: number): Observable<PluginSwitchDetailsDto> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        return combineLatest([of(entity), this.zigbeeMqttService.getSwitchStatus(entity.zigbeeDeviceId)]);
      }),
      map(([entity, response]) => ({
        type: DeviceType.POWER_PLUG,
        name: entity.deviceName,
        homeDeviceId: entity.zigbeeDeviceId,
        id: entity.id,
        isOnline: response.payload.linkquality > 0,
        isOn: response.payload.state === 'ON',
        signalStrength: calculatePercentage(0, 255, response.payload.linkquality),
      }))
    );
  }

  public setPluginSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return from(this._homeDeviceRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`Home Device not found for id: ${id}`);
        }

        return this.zigbeeMqttService.setSwitchOn(entity.zigbeeDeviceId, isOn);
      })
    );
  }

  public enableParingMode(): Observable<void> {
    return from(this.zigbeeMqttService.allowDeviceJoin());
  }

  private _toDeviceDto(device: HomeDevice): HomeDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      homeDeviceId: device.zigbeeDeviceId,
    };
  }
}
