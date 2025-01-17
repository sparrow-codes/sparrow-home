import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { HomeDeviceDetailsApiModel } from '@sparrow-server/external-api';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';

export class HomeDeviceDetailsMapper {
  public static map(entity: HomeDevice, device: HomeDeviceDetailsApiModel): HomeDeviceDetailsDto {
    const dto: HomeDeviceDetailsDto = this._prepareBasicDto(entity, device);

    if (entity.deviceType === DeviceType.POWER_PLUG) {
      return {
        ...dto,
        isOn: device.commands?.find(() => entity.deviceType === DeviceType.POWER_PLUG)?.value ?? false,
      } as PluginSwitchDetailsDto;
    }

    return dto;
  }

  private static _prepareBasicDto(entity: HomeDevice, device: HomeDeviceDetailsApiModel): HomeDeviceDetailsDto {
    return {
      id: entity.id,
      name: entity.deviceName,
      type: entity.deviceType,
      zigbeeDeviceId: entity.zigbeeDeviceId,
      isOnline: device.online ?? false,
    };
  }
}
