import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AlarmApiService } from '@sparrow-home/api';
import { first, Observable, pipe, switchMap } from 'rxjs';

interface AlarmState {
  isActive: boolean;
}

export const AlarmStore = signalStore(
  { providedIn: 'root' },
  withState<AlarmState>({ isActive: false }),
  withMethods((_store, apiService: AlarmApiService = inject(AlarmApiService), snackBar = inject(MatSnackBar)) => {
    function getAlarmMode(): Observable<boolean> {
      return apiService.getAlarmMode().pipe(
        tapResponse({
          next: (value) => patchState(_store, { isActive: value }),
          error: () => snackBar.open('Nie udało się pobrać szczegołów alarmu'),
        })
      );
    }

    return {
      setAlarm: rxMethod<boolean>(pipe(switchMap((isOn) => apiService.setAlarm({ body: { isOn } })))),
      getAlarmMode: rxMethod<void>(pipe(switchMap(getAlarmMode))),
      setAlarmMode: rxMethod<boolean>(
        pipe(
          switchMap((isActive) =>
            apiService.setAlarmMode({ body: { isActive } }).pipe(
              first(),
              tapResponse({
                next: () => snackBar.open(isActive ? 'Ustawiono Alarm!' : 'Alarm dezaktywowano!'),
                error: () => snackBar.open('Błąd podczas ustawiania alarmu!'),
              }),
              switchMap(getAlarmMode)
            )
          )
        )
      ),
    };
  })
);
