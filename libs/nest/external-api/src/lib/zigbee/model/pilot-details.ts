import { SensorDetails } from './sensor-details';

export interface PilotDetails extends SensorDetails {
  action: 'arm_all_zones' | 'arm_day_zones' | 'disarm' | 'panic';
}
