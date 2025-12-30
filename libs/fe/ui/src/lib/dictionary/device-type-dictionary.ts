import { DeviceType } from '@sparrow-home/utils';

export const deviceTypeDictionary: Map<DeviceType, string> = new Map([
  [DeviceType.POWER_PLUG, 'ui.device_types.power_plug'],
  [DeviceType.TEMPERATURE_SENSOR, 'ui.device_types.temperature_sensor'],
  [DeviceType.OPEN_DOOR_SENSOR, 'ui.device_types.open_door_sensor'],
  [DeviceType.SIREN, 'ui.device_types.siren'],
  [DeviceType.PILOT, 'ui.device_types.pilot'],
  [DeviceType.OTHER, 'ui.device_types.other'],
]);
