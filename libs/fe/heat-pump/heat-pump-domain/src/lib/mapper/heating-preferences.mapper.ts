import { GetHeatingPreferencesResponseApiModel } from '@sparrow-home/api';

import { HeatingPreferences } from '../models';

export class HeatingPreferencesMapper {
  public static map(response: GetHeatingPreferencesResponseApiModel): HeatingPreferences {
    return {
      isAutomaticHeat: response.isAutomaticHeat,
      groundFlorTemperatureSensorId: response.groundFlorTemperatureSensorId ?? undefined,
      firstFlorTemperatureSensorId: response.firstFlorTemperatureSensorId ?? undefined,
      maxTargetTemperature: response.maxTargetTemperature ?? undefined,
      minTargetTemperature: response.minTargetTemperature ?? undefined,
    };
  }
}
