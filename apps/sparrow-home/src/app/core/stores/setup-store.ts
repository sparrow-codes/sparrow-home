import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { catchError, first, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

import { SetupApiService } from '~api/setup/setup-api.service';
import { Configuration } from '~core/models/configuration';

interface SetupStoreState {
  isConfigurationReady: boolean | null;
  modeDictionary: { value: number; label: string }[];
  configuration: Configuration | null;
}

export const SetupStore = signalStore(
  { providedIn: 'root' },
  withState<SetupStoreState>({ isConfigurationReady: null, configuration: null, modeDictionary: [] }),
  withMethods((store, apiService = inject(SetupApiService), toastService = inject(SpToastService)) => ({
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
          error: () => toastService.danger('Konfiguracja', 'Błąd pobierania konfiguracji!'),
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
                mode: response.currentMode,
                lat: response.lat,
                lng: response.lng,
              },
              modeDictionary: response.dictionaries.modeDictionary,
            }),
          error: () => toastService.danger('Konfiguracja', 'Błąd pobierania konfiguracji!'),
        }),
        map(() => void 0)
      );
    },
    setMode: rxMethod<number>(
      pipe(
        switchMap((mode) =>
          apiService.setMode(mode).pipe(
            first(),
            tapResponse({
              next: () =>
                toastService.success(
                  'Konfiguracja',
                  `Zmieniono tryb pracy na ${
                    store.modeDictionary().find((dictionary) => dictionary.value === mode)?.label ?? ''
                  }`
                ),
              error: () => toastService.danger('Konfiguracja', 'Błąd zmiany konfiguracji!'),
            })
          )
        )
      )
    ),
    setConfiguration: rxMethod<Configuration>(
      pipe(
        tap((configuration) => patchState(store, { configuration })),
        switchMap((configuration) =>
          apiService.changeConfiguration({ lng: configuration.lng, lat: configuration.lat }).pipe(
            first(),
            tapResponse({
              next: () => toastService.success('Konfiguracja', 'Zapisano pomyślnie!'),
              error: () => toastService.danger('Konfiguracja', 'Błąd zmiany konfiguracji!'),
            })
          )
        )
      )
    ),
  }))
);
