import { TuyaDeviceApiModel } from '@sparrow-home/api';

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
}
