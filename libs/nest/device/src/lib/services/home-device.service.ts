import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { Observable, of } from 'rxjs';
import { Repository } from 'typeorm';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceDto } from '../models/home-device-dto';

@Injectable()
export class HomeDeviceService {
  public constructor(@InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>) {}

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

  public getDeviceDetails(id: number): Observable<HomeDeviceDetailsDto> {
    return of({} as HomeDeviceDetailsDto);
  }

  public setPluginSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return of(true);
  }

  private _toDeviceDto(device: HomeDevice): HomeDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      zigbeeDeviceId: device.zigbeeDeviceId,
    };
  }
}
