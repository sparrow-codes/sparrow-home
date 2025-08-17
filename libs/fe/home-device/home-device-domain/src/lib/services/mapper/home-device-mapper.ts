import {
  HomeDeviceDetailsDtoApiModel,
  OpenDoorSensorDetailsDtoApiModel,
  PilotDetailsDtoApiModel,
  PluginSwitchDetailsDtoApiModel,
  SirenDetailsDtoApiModel,
  TemperatureSensorDetailsDtoApiModel,
} from '@sparrow-home/api';
import { DeviceType } from '@sparrow-home/utils';

import { HomeDevice, Siren } from '../../models';
import { OpenDoorSensor } from '../../models/open-door-sensor';
import { Pilot } from '../../models/pilot';
import { SwitchDevice } from '../../models/switch-device';
import { TemperatureSensor } from '../../models/temperature-sensor';

export class HomeDeviceMapper {
  public static mapDetails(device: HomeDeviceDetailsDtoApiModel): HomeDevice {
    const homeDevice: HomeDevice = HomeDeviceMapper._mapDevice(device);

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

    if (device.type === DeviceType.SIREN) {
      const siren: SirenDetailsDtoApiModel = device as SirenDetailsDtoApiModel;
      return {
        ...homeDevice,
        battery: siren.battery,
      } as Siren;
    }

    if (device.type === DeviceType.PILOT) {
      const pilot: PilotDetailsDtoApiModel = device as PilotDetailsDtoApiModel;
      return {
        ...homeDevice,
        battery: pilot.battery,
        isOnline: null,
      } as Pilot;
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
