import { HomeDevice } from '.';

export interface TemperatureSensor extends HomeDevice {
  battery?: number;
  temperature?: number;
  humidity?: number;
}
