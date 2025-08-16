import { DeviceType } from '@sparrow-home/utils';

export interface HomeDevice {
  id: number;
  type: DeviceType;
  name: string;
  homeDeviceId: string;
  isOnline?: boolean | null;
  signalStrength?: number;
}
