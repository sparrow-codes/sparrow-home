import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SetupApiService } from '@sparrow-home/api';
import { catchError, first, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

import { Configuration } from '../models/configuration';

interface SetupStoreState {
  isConfigurationReady: boolean | null;
  configuration: Configuration | null;
}

export const SetupStore = signalStore(
  { providedIn: 'root' },
  withState<SetupStoreState>({ isConfigurationReady: null, configuration: null }),
  withMethods((store, apiService = inject(SetupApiService), snackBar = inject(MatSnackBar)) => ({
    verifyConfigurationReady: (): Observable<boolean> => {
      return apiService.isConfigurationReady().pipe(
        first(),
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return of(false);
          }
          throw error;
        }),
        tapResponse({
          next: (value) => patchState(store, { isConfigurationReady: value }),
          error: () => snackBar.open('Konfiguracja - Błąd pobierania konfiguracji!', 'Zamknij'),
        })
      );
    },
    getCurrentSetup: (): Observable<void> => {
      return apiService.getCurrentSetup().pipe(
        first(),
        tapResponse({
          next: (response) =>
            patchState(store, {
              configuration: {
                lat: response.lat,
                lng: response.lng,
              },
            }),
          error: () => snackBar.open('Konfiguracja - Błąd pobierania konfiguracji!', 'Zamknij'),
        }),
        map(() => void 0)
      );
    },
    setConfiguration: rxMethod<Configuration>(
      pipe(
        tap((configuration) => patchState(store, { configuration })),
        switchMap((configuration) =>
          apiService
            .changeConfiguration({
              lng: configuration.lng,
              lat: configuration.lat,
            })
            .pipe(
              first(),
              tapResponse({
                next: () => snackBar.open('Konfiguracja - Zapisano pomyślnie!', 'Zamknij'),
                error: () => snackBar.open('Konfiguracja - Błąd zmiany konfiguracji!', 'Zamknij'),
              })
            )
        )
      )
    ),
  }))
);
