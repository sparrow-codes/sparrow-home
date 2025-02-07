import { GetHeatingPreferencesResponse } from '@sparrow-home/api';

import { HeatingPreferences } from '../models';

export class HeatingPreferencesMapper {
  public static map(response: GetHeatingPreferencesResponse): HeatingPreferences {
    return {
      isAutomaticHeat: response.isAutomaticHeat,
      groundFlorTemperatureSensorId: response.groundFlorTemperatureSensorId,
      firstFlorTemperatureSensorId: response.firstFlorTemperatureSensorId,
      maxTargetTemperature: response.maxTargetTemperature,
      minTargetTemperature: response.minTargetTemperature,
    };
  }
}
