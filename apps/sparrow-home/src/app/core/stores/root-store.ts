import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { AppConfig } from '~core/models/app-config';

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
  withMethods((store) => ({
    saveAppConfig: (appConfig: AppConfig): void => {
      patchState(store, { appConfig });
    },
  }))
);
