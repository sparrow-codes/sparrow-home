import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TuyaDevice, TuyaDeviceType } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

import { TuyaDeviceDetailsDto } from '../models/tuya-device-details-dto';
import { TuyaDeviceDto } from '../models/tuya-device-dto';

@Injectable()
export class TuyaService {
  public constructor(@InjectRepository(TuyaDevice) private readonly _tuyaRepository: Repository<TuyaDevice>) {}

  public async getListOfDevices(): Promise<TuyaDeviceDto[]> {
    const devices: TuyaDevice[] = await this._tuyaRepository.find();
    return devices.map(this._toDeviceDto);
  }

  public async addDevice(type: TuyaDeviceType, tuyaDeviceId: string, name: string): Promise<void> {
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

  public async getDeviceDetails(id: number): Promise<TuyaDeviceDetailsDto> {
    const device: TuyaDevice | null = await this._tuyaRepository.findOneBy({ id });
    if (!device) {
      throw new NotFoundException(`TuyaDevice not found for id: ${id}`);
    }

    return this._toDeviceDetailsDto(device);
  }

  private _toDeviceDto(device: TuyaDevice): TuyaDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      tuyaDeviceId: device.tuyaDeviceId,
    };
  }

  private _toDeviceDetailsDto(device: TuyaDevice): TuyaDeviceDetailsDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      tuyaDeviceId: device.tuyaDeviceId,
    };
  }
}
