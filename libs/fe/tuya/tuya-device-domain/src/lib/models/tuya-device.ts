import { DeviceType } from '../enums';

export interface TuyaDevice {
  id: number;
  type: DeviceType;
  name: string;
  tuyaDeviceId: string;
  isOnline?: boolean;
}
