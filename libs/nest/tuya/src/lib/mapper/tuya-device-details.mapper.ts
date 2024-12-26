import { TuyaDevice, TuyaDeviceType } from '@sparrow-server/entities';
import { TuyaDeviceDetailsCloudModel } from '@sparrow-server/external-api';

import { LCS_SWITCH_CODE } from '../codes/codes';
import { TuyaDeviceDetailsDto } from '../models/tuya-device-details-dto';
import { TuyaLcsSwitchDetailsDto } from '../models/tuya-lcs-switch-details.dto';

export class TuyaDeviceDetailsMapper {
  public static map(entity: TuyaDevice, device: TuyaDeviceDetailsCloudModel): TuyaDeviceDetailsDto {
    const dto: TuyaDeviceDetailsDto = this._prepareBasicDto(entity, device);

    if (entity.deviceType === TuyaDeviceType.LSC_POWER_PLUG) {
      return {
        ...dto,
        isOn: device.commands?.find((command) => command.code === LCS_SWITCH_CODE)?.value ?? false,
      } as TuyaLcsSwitchDetailsDto;
    }

    return dto;
  }

  private static _prepareBasicDto(entity: TuyaDevice, device: TuyaDeviceDetailsCloudModel): TuyaDeviceDetailsDto {
    return {
      id: entity.id,
      name: entity.deviceName,
      type: entity.deviceType,
      tuyaDeviceId: entity.tuyaDeviceId,
      isOnline: device.online ?? false,
    };
  }
}
