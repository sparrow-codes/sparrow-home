import { DeviceAction } from '@sparrow-home/utils';

export interface AvailableDevice {
  id: string;
  name: string;
  description: string;
  homeDeviceId: string;
  actions: DeviceAction[];
}
