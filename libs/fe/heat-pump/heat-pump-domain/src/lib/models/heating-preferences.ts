export interface HeatingPreferences {
  isAutomaticHeat?: boolean;
  groundFlorTemperatureSensorId?: number;
  firstFlorTemperatureSensorId?: number;
  minTargetTemperature?: number;
  maxTargetTemperature?: number;
}
