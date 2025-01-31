import {
  HomeDeviceApiModel,
  HomeDeviceDetailsApiModel,
  OpenDoorSensorDetailsApiModel,
  SwitchDetailsApiModel,
  TemperatureSensorDetailsApiModel,
} from '@sparrow-home/api';

import { DeviceType } from '../../enums';
import { HomeDevice } from '../../models';
import { OpenDoorSensor } from '../../models/open-door-sensor';
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

    if (device.type === DeviceType.OPEN_DOOR_SENSOR) {
      const openDoorSensor: OpenDoorSensorDetailsApiModel = device as OpenDoorSensorDetailsApiModel;
      return {
        ...homeDevice,
        battery: openDoorSensor.battery,
        isOpen: openDoorSensor.isOpen,
      } as OpenDoorSensor;
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
