import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TuyaDevice } from '../entities/tuyaDevice';
import { DeviceType } from '../enums/device-type';
import { TuyaDeviceDTO } from '../models/TuyaDeviceDTO';

@Injectable()
export class TuyaService {
  public constructor(@InjectRepository(TuyaDevice) private readonly _tuyaRepository: Repository<TuyaDevice>) {}

  public async getListOfDevices(): Promise<TuyaDeviceDTO[]> {
    const devices: TuyaDevice[] = await this._tuyaRepository.find();
    return devices.map(this._toDto);
  }

  public async addDevice(type: DeviceType, tuyaDeviceId: string, name: string): Promise<void> {
    if (await this._tuyaRepository.findOneBy({ tuyaDeviceId })) {
      throw new ForbiddenException('TuyaDevice already exists!');
    }

    const device: TuyaDevice = new TuyaDevice();
    device.deviceType = type;
    device.tuyaDeviceId = tuyaDeviceId;
    device.deviceName = name;
    await this._tuyaRepository.save(device);
  }

  public async removeDevice(id: number): Promise<void> {
    await this._tuyaRepository.delete({ id });
  }

  private _toDto(device: TuyaDevice): TuyaDeviceDTO {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      tuyaDeviceId: device.tuyaDeviceId,
    };
  }
}
