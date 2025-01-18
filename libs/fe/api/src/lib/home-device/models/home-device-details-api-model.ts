export interface HomeDeviceDetailsApiModel {
  id: number;
  type: number;
  homeDeviceId: string;
  name: string;
  isOnline: boolean;
  signalStrength: number;
}
