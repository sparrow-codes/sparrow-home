import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApiConfiguration } from '@sparrow-home/api';

import { AppConfig } from '../models';

type RootState = {
  lowestTemperatureAtNight: number | undefined;
  appConfig: AppConfig | null;
};

export const RootStore = signalStore(
  { providedIn: 'root' },
  withState<RootState>({
    lowestTemperatureAtNight: undefined,
    appConfig: null,
  } as RootState),
  withMethods((store, apiConfiguration = inject(ApiConfiguration)) => ({
    saveAppConfig: (appConfig: AppConfig): void => {
      patchState(store, { appConfig });
      apiConfiguration.rootUrl = `${appConfig.backendUrl}`;
    },
  }))
);
