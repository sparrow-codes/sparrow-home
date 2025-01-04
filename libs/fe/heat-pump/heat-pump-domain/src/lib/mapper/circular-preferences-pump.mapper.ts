import { GetCircularPumpPreferencesResponse } from '@sparrow-home/api';

import { CircularPumpPreferences } from '../models';

export abstract class CircularPreferencesPumpMapper {
  public static map(response: GetCircularPumpPreferencesResponse): CircularPumpPreferences {
    const preferences: CircularPumpPreferences = new CircularPumpPreferences();
    preferences.isActive = response.isActive ?? false;
    preferences.scheduledStartTime = response.circularPumpStartTime
      ? new Date(response.circularPumpStartTime)
      : undefined;
    preferences.scheduledEndTime = response.circularPumpEndTime ? new Date(response.circularPumpEndTime) : undefined;
    preferences.tuyaDeviceId = response.tuyaDeviceId;
    return preferences;
  }
}
