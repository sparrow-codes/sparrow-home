import { SensorDetails } from './sensor-details';

export interface SonoffTemperatureSensorDetails extends SensorDetails {
  temperature: number;
  humidity: number;
}
