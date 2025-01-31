import { DeviceType } from '@sparrow-home/home-device-domain';

export const deviceTypeDictionary: Map<DeviceType, string> = new Map([
  [DeviceType.POWER_PLUG, 'Gniazdko'],
  [DeviceType.TEMPERATURE_SENSOR, 'Czujnik temperatury'],
  [DeviceType.OPEN_DOOR_SENSOR, 'Czujnik otwarcia'],
]);
