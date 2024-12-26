import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TuyaDevice, TuyaDeviceType } from '@sparrow-server/entities';
import { TuyaApiService } from '@sparrow-server/external-api';
import { combineLatest, first, from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { LCS_SWITCH_CODE } from '../codes/codes';
import { TuyaDeviceDetailsMapper } from '../mapper/tuya-device-details.mapper';
import { TuyaDeviceDetailsDto } from '../models/tuya-device-details-dto';
import { TuyaDeviceDto } from '../models/tuya-device-dto';

@Injectable()
export class TuyaService {
  public constructor(
    @InjectRepository(TuyaDevice) private readonly _tuyaRepository: Repository<TuyaDevice>,
    private readonly _tuyaApiService: TuyaApiService
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

          return combineLatest([of(entity), this._tuyaApiService.getDeviceStatus(entity.tuyaDeviceId)]);
        })
      )
      .pipe(map(([entity, device]) => TuyaDeviceDetailsMapper.map(entity, device)));
  }

  public setLcsSwitchStatus(id: number, isOn: boolean): Observable<boolean> {
    return from(this._tuyaRepository.findOneBy({ id })).pipe(
      first(),
      switchMap((entity) => {
        if (!entity) {
          throw new NotFoundException(`TuyaDevice not found for id: ${id}`);
        }

        return this._tuyaApiService.sendCommands(entity.tuyaDeviceId, [{ code: LCS_SWITCH_CODE, value: isOn }]);
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
}
