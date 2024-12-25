import { TuyaDeviceApiModel, TuyaDeviceDetailsApiModel } from '@sparrow-home/api';

import { TuyaDevice } from '../../models';

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
    return {
      id: device.id,
      tuyaDeviceId: device.tuyaDeviceId,
      name: device.name,
      type: device.type,
      isOnline: device.isOnline,
    };
  }
}
