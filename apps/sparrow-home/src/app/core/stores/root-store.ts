import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
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
  withMethods(
    (
      store,
      weatherApiService = inject(WeatherApiService),
      snackBar = inject(MatSnackBar),
      loaderService = inject(LoaderService)
    ) => ({
      fetchLowestTemperature: rxMethod<void>(
        pipe(
          tap(() => (loaderService.showLoader = true)),
          switchMap(() =>
            weatherApiService.getLowestTemperatureByNight().pipe(
              tapResponse({
                next: (temperature) => patchState(store, { lowestTemperatureAtNight: temperature }),
                error: (error: HttpErrorResponse) => {
                  if (error.status !== HttpStatusCode.Unauthorized) {
                    snackBar.open('Błąd pobierania nocnej temperatury', 'Zamknij');
                  }
                },
              }),
              finalize(() => (loaderService.showLoader = false))
            )
          )
        )
      ),
      saveAppConfig: (appConfig: AppConfig): void => {
        patchState(store, { appConfig });
      },
    })
  )
);
