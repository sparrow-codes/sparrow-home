import { TuyaDeviceApiModel, TuyaDeviceDetailsApiModel, TuyaLcsSwitchDetailsApiModel } from '@sparrow-home/api';

import { DeviceType } from '../../enums';
import { TuyaDevice } from '../../models';
import { LcsSwitch } from '../../models/lcs-switch';

export class TuyaDeviceMapper {
  public static map(device: TuyaDeviceApiModel): TuyaDevice {
    return {
      id: device.id,
      tuyaDeviceId: device.tuyaDeviceId,
      name: device.name,
      type: device.type,
    };
  }

  public static mapDetails(device: TuyaDeviceDetailsApiModel): TuyaDevice {
    const tuyaDevice: TuyaDevice = this._mapDevice(device);

    if (device.type === DeviceType.LSC_POWER_PLUG) {
      const lscSwitch: TuyaLcsSwitchDetailsApiModel = device as TuyaLcsSwitchDetailsApiModel;
      return {
        ...device,
        isOn: lscSwitch.isOn,
      } as LcsSwitch;
    }

    return tuyaDevice;
  }

  private static _mapDevice(device: TuyaDeviceDetailsApiModel): TuyaDevice {
    return {
      id: device.id,
      tuyaDeviceId: device.tuyaDeviceId,
      name: device.name,
      type: device.type,
      isOnline: device.isOnline,
    };
  }
}
