export interface GetHeatingPreferencesResponse {
  isAutomaticHeat: boolean;
  groundFlorTemperatureSensorId?: number;
  firstFlorTemperatureSensorId?: number;
  minTargetTemperature?: number;
  maxTargetTemperature?: number;
}
