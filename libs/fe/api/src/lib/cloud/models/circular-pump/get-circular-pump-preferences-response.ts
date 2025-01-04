export interface GetCircularPumpPreferencesResponse {
  isActive: boolean;
  tuyaDeviceId?: string;
  circularPumpStartTime?: Date;
  circularPumpEndTime?: Date;
}
