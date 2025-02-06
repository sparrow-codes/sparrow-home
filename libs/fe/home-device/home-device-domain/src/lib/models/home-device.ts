import { DeviceType } from '@sparrow-home/core';

export interface HomeDevice {
  id: number;
  type: DeviceType;
  name: string;
  homeDeviceId: string;
  isOnline?: boolean;
  signalStrength?: number;
}
