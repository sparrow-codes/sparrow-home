import { HomeDeviceApiModel, HomeDeviceDetailsApiModel, SwitchDetailsApiModel } from '@sparrow-home/api';

import { DeviceType } from '../../enums';
import { HomeDevice } from '../../models';
import { SwitchDevice } from '../../models/switch-device';

export class HomeDeviceMapper {
  public static map(device: HomeDeviceApiModel): HomeDevice {
    return {
      id: device.id,
      homeDeviceId: device.homeDeviceId,
      name: device.name,
      type: device.type,
    };
  }

  public static mapDetails(device: HomeDeviceDetailsApiModel): HomeDevice {
    const homeDevice: HomeDevice = this._mapDevice(device);

    if (device.type === DeviceType.POWER_PLUG) {
      const switchDevice: SwitchDetailsApiModel = device as SwitchDetailsApiModel;
      return {
        ...device,
        isOn: switchDevice.isOn,
        signalStrength: switchDevice.signalStrength,
      } as SwitchDevice;
    }

    return homeDevice;
  }

  private static _mapDevice(device: HomeDeviceDetailsApiModel): HomeDevice {
    return {
      id: device.id,
      homeDeviceId: device.homeDeviceId,
      name: device.name,
      type: device.type,
      isOnline: device.isOnline,
    };
  }
}
