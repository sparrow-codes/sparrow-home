import { HomeDevice } from '.';

export interface TemperatureSensor extends HomeDevice {
  temperature?: number;
  humidity?: number;
}
