import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ApiConfiguration } from '@sparrow-home/api';

import { AppConfig } from '../models';
import { NewVersionService } from '../services/new-version.service';
import { VisibilityService } from '../services/visibility.service';

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
  })),
  withHooks((_store, visibilityService = inject(VisibilityService), newVersionService = inject(NewVersionService)) => ({
    onInit: (): void => {
      visibilityService.listenToVisibilityChange();
      newVersionService.listenToNewVersionChange();
    },
  }))
);
