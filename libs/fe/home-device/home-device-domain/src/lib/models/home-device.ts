import { DeviceType } from '../enums';

export interface HomeDevice {
  id: number;
  type: DeviceType;
  name: string;
  homeDeviceId: string;
  isOnline?: boolean;
  signalStrength?: number;
}
