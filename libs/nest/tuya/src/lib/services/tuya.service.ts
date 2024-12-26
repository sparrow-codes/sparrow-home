import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TuyaDevice, TuyaDeviceType } from '@sparrow-server/entities';
import { LscSwitchApiService, TuyaDeviceDetailsCloudModel } from '@sparrow-server/external-api';
import { combineLatest, first, from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { TuyaDeviceDetailsDto } from '../models/tuya-device-details-dto';
import { TuyaDeviceDto } from '../models/tuya-device-dto';

@Injectable()
export class TuyaService {
  public constructor(
    @InjectRepository(TuyaDevice) private readonly _tuyaRepository: Repository<TuyaDevice>,
    private readonly _lscSwitchApiService: LscSwitchApiService
  ) {}

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

  public getDeviceDetails(id: number): Observable<TuyaDeviceDetailsDto> {
    return from(this._tuyaRepository.findOneBy({ id }))
      .pipe(
        first(),
        switchMap((entity) => {
          if (!entity) {
            throw new NotFoundException(`TuyaDevice not found for id: ${id}`);
          }

          return combineLatest([of(entity), this._lscSwitchApiService.getDeviceDetails(entity.tuyaDeviceId)]);
        })
      )
      .pipe(map(([entity, device]) => this._toDeviceDetailsDto(entity, device)));
  }

  public setLcsSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return from(this._tuyaRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`TuyaDevice not found for id: ${id}`);
        }

        return this._lscSwitchApiService.setSwitch(entity.tuyaDeviceId, isOn);
      })
    );
  }

  private _toDeviceDto(device: TuyaDevice): TuyaDeviceDto {
    return {
      id: device.id,
      name: device.deviceName,
      type: device.deviceType,
      tuyaDeviceId: device.tuyaDeviceId,
    };
  }

  private _toDeviceDetailsDto(entity: TuyaDevice, device: TuyaDeviceDetailsCloudModel): TuyaDeviceDetailsDto {
    return {
      id: entity.id,
      name: entity.deviceName,
      type: entity.deviceType,
      tuyaDeviceId: entity.tuyaDeviceId,
      isOnline: device.online ?? false,
    };
  }
}
