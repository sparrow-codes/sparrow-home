import { SensorDetails } from './sensor-details';

export interface OpenDoorSensorDetails extends SensorDetails {
  contact: boolean;
}
