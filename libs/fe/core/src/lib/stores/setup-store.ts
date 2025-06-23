import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SetupApiService } from '@sparrow-home/api';
import { MessageService } from 'primeng/api';
import { catchError, first, map, Observable, of, pipe, switchMap, tap } from 'rxjs';

import { Configuration } from '../models';

interface SetupStoreState {
  isConfigurationReady: boolean | null;
  configuration: Configuration | null;
}

export const SetupStore = signalStore(
  { providedIn: 'root' },
  withState<SetupStoreState>({ isConfigurationReady: null, configuration: null }),
  withMethods((store, apiService = inject(SetupApiService), messageService = inject(MessageService)) => ({
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
          error: () => messageService.add({ summary: 'Błąd pobierania konfiguracji!', severity: 'error' }),
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
          error: () => messageService.add({ summary: 'Błąd pobierania konfiguracji!', severity: 'error' }),
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
              body: {
                lng: configuration.lng,
                lat: configuration.lat,
              },
            })
            .pipe(
              first(),
              tapResponse({
                next: () => messageService.add({ summary: 'Zapisano!', severity: 'contrast' }),
                error: () => messageService.add({ summary: 'Błąd zmiany konfiguracji!', severity: 'error' }),
              })
            )
        )
      )
    ),
  }))
);
