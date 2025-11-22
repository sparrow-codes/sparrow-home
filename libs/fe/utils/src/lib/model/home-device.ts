import { DeviceType } from '../enum';
import { DeviceAction } from './device-action';

export interface HomeDevice {
  id: number;
  type: DeviceType;
  name: string;
  homeDeviceId: string;
  isOnline?: boolean | null;
  signalStrength?: number;
  battery: number | null;
  model: string;
  vendor: string;
  description: string;
  params: Record<string, string>;
  actions: DeviceAction[];
  mainActionKey: string | null;
  mainParamKey: string | null;
}
