import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { WeatherApiService } from '~api/weather/weather-api.service';
import { AppConfig } from '~core/models/app-config';
import { LoaderService } from '~ui/services/loader.service';

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
  withMethods((store, weatherApiService = inject(WeatherApiService), toastService = inject(SpToastService), loaderService = inject(LoaderService)) => ({
    fetchLowestTemperature: rxMethod<void>(
      pipe(
        tap(() => loaderService.showLoader = true),
        switchMap(() =>
          weatherApiService.getLowestTemperatureByNight().pipe(
            tapResponse({
              next: (temperature) => patchState(store, { lowestTemperatureAtNight: temperature }),
              error: (error: HttpErrorResponse) => {
                if(error.status !== HttpStatusCode.Unauthorized) {
                  toastService.danger('Pogoda', 'Błąd pobierania nocnej temperatury');
                }
              },
            }),
            finalize(() => loaderService.showLoader = false)
          )
        ),
      
      )
    ),
    saveAppConfig: (appConfig: AppConfig): void => {
      patchState(store, { appConfig });
    },
  }))
);
