import { DeviceType } from '@sparrow-home/utils';

export const deviceTypeDictionary: Map<DeviceType, string> = new Map([
  [DeviceType.POWER_PLUG, 'Gniazdko'],
  [DeviceType.TEMPERATURE_SENSOR, 'Czujnik temperatury'],
  [DeviceType.OPEN_DOOR_SENSOR, 'Czujnik otwarcia'],
  [DeviceType.SIREN, 'Syrena alarmowa'],
  [DeviceType.PILOT, 'Pilot'],
  [DeviceType.PET_FEEDER, 'Karmink dla zwierząt'],
]);
