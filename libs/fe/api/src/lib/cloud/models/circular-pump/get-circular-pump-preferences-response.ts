export interface GetCircularPumpPreferencesResponse {
  isActive: boolean;
  homeDeviceId?: string;
  circularPumpStartTime?: Date;
  circularPumpEndTime?: Date;
}
