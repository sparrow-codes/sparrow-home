import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AlarmApiService } from '@sparrow-home/api';
import { pipe, switchMap } from 'rxjs';

export const AlarmStore = signalStore(
  { providedIn: 'root' },
  withMethods((_store, apiService: AlarmApiService = inject(AlarmApiService)) => ({
    setAlarm: rxMethod<boolean>(pipe(switchMap((isOn) => apiService.setAlarm({ body: { isOn } })))),
  }))
);
