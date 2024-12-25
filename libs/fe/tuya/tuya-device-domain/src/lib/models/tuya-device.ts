export interface TuyaDevice {
  id: number;
  type: number;
  name: string;
  tuyaDeviceId: string;
  isOnline?: boolean;
}
