import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { pipe, switchMap } from 'rxjs';

import { WeatherApiService } from '~api/weather/weather-api.service';

type RootState = {
  loading: boolean;
  lowestTemperatureAtNight: number | undefined;
};

export const RootStore = signalStore(
  { providedIn: 'root' },
  withState<RootState>({
    loading: false,
    lowestTemperatureAtNight: undefined,
  } as RootState),
  withMethods((store, weatherApiService = inject(WeatherApiService), toastService = inject(SpToastService)) => ({
    fetchLowestTemperature: rxMethod<void>(
      pipe(
        switchMap(() =>
          weatherApiService.getLowestTemperatureByNight().pipe(
            tapResponse({
              next: (temperature) => patchState(store, { lowestTemperatureAtNight: temperature }),
              error: () => toastService.danger('Pogoda', 'Błąd pobierania nocnej temperatury'),
            })
          )
        )
      )
    ),
  }))
);
