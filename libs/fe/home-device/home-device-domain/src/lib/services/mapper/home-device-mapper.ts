import {
  HomeDeviceDetailsDtoApiModel,
  HomeDeviceDtoApiModel,
  OpenDoorSensorDetailsDtoApiModel,
  PluginSwitchDetailsDtoApiModel,
  TemperatureSensorDetailsDtoApiModel,
} from '@sparrow-home/api';
import { DeviceType } from '@sparrow-home/core';

import { HomeDevice } from '../../models';
import { OpenDoorSensor } from '../../models/open-door-sensor';
import { SwitchDevice } from '../../models/switch-device';
import { TemperatureSensor } from '../../models/temperature-sensor';

export class HomeDeviceMapper {
  public static map(device: HomeDeviceDtoApiModel): HomeDevice {
    return {
      id: device.id,
      homeDeviceId: device.homeDeviceId,
      name: device.name,
      type: device.type,
    };
  }

  public static mapDetails(device: HomeDeviceDetailsDtoApiModel): HomeDevice {
    const homeDevice: HomeDevice = this._mapDevice(device);

    if (device.type === DeviceType.POWER_PLUG) {
      const switchDevice: PluginSwitchDetailsDtoApiModel = device as PluginSwitchDetailsDtoApiModel;
      return {
        ...homeDevice,
        isOn: switchDevice.isOn,
      } as SwitchDevice;
    }

    if (device.type === DeviceType.TEMPERATURE_SENSOR) {
      const temperatureSensor: TemperatureSensorDetailsDtoApiModel = device as TemperatureSensorDetailsDtoApiModel;
      return {
        ...homeDevice,
        battery: temperatureSensor.battery,
        temperature: temperatureSensor.temperature,
        humidity: temperatureSensor.humidity,
      } as TemperatureSensor;
    }

    if (device.type === DeviceType.OPEN_DOOR_SENSOR) {
      const openDoorSensor: OpenDoorSensorDetailsDtoApiModel = device as OpenDoorSensorDetailsDtoApiModel;
      return {
        ...homeDevice,
        battery: openDoorSensor.battery,
        isOpen: openDoorSensor.isOpen,
        lastOpened: openDoorSensor.lastOpened ? new Date(openDoorSensor.lastOpened) : undefined,
      } as OpenDoorSensor;
    }

    return homeDevice;
  }

  private static _mapDevice(device: HomeDeviceDetailsDtoApiModel): HomeDevice {
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
