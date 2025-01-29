import {
  HomeDeviceApiModel,
  HomeDeviceDetailsApiModel,
  SwitchDetailsApiModel,
  TemperatureSensorDetailsApiModel,
} from '@sparrow-home/api';

import { DeviceType } from '../../enums';
import { HomeDevice } from '../../models';
import { SwitchDevice } from '../../models/switch-device';
import { TemperatureSensor } from '../../models/temperature-sensor';

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
        ...homeDevice,
        isOn: switchDevice.isOn,
      } as SwitchDevice;
    }

    if (device.type === DeviceType.TEMPERATURE_SENSOR) {
      const temperatureSensor: TemperatureSensorDetailsApiModel = device as TemperatureSensorDetailsApiModel;
      return {
        ...homeDevice,
        battery: temperatureSensor.battery,
        temperature: temperatureSensor.temperature,
        humidity: temperatureSensor.humidity,
      } as TemperatureSensor;
    }

    return homeDevice;
  }

  private static _mapDevice(device: HomeDeviceDetailsApiModel): HomeDevice {
    return {
      id: device.id,
      homeDeviceId: device.homeDeviceId,
      name: device.name,
      type: device.type,
      signalStrength: device.signalStrength,
      isOnline: device.isOnline,
    };
  }
}
