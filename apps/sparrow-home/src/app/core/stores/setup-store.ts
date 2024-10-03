import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpStatus } from '@nestjs/common';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { catchError, first, map, Observable, of } from 'rxjs';

import { SetupApiService } from '~api/setup/setup-api.service';

interface SetupStoreState {
  isConfigurationReady: boolean | null;
}

export const SetupStore = signalStore(
  { providedIn: 'root' },
  withState<SetupStoreState>({ isConfigurationReady: null }),
  withMethods((store, apiService = inject(SetupApiService), toastService = inject(SpToastService)) => ({
    verifyConfigurationReady: (): Observable<boolean> => {
      return apiService.isConfigurationReady().pipe(
        first(),
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatus.UNAUTHORIZED) {
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
  }))
);
