import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { combineLatest, finalize, map, Observable, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AlarmApiService, HomeDeviceApiService } from '@sparrow-home/api';
import { tapResponse } from '@ngrx/operators';
import { LoaderService } from '@sparrow-home/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface MainPanelStoreState {
  avgTemperature: number | null;
  isAlarmOn: boolean;
}

export const MainPanelStore = signalStore(
  { providedIn: 'root' },
  withState<MainPanelStoreState>({
    avgTemperature: null,
    isAlarmOn: false,
  }),
  withMethods(
    (
      store,
      homeDeviceApiService = inject(HomeDeviceApiService),
      alarmApiService = inject(AlarmApiService),
      loaderService = inject(LoaderService)
    ) => {
      function getAvgTemperature(): Observable<number> {
        return homeDeviceApiService.getHomeAvgTemperature().pipe(
          map((res) => res.avgTemperature),
          tapResponse({
            next: (temperature) => patchState(store, { avgTemperature: temperature }),
            error: () => console.log('Error getting temperature'),
          })
        );
      }

      function getAlarmStatus(): Observable<boolean> {
        return alarmApiService.getAlarmMode().pipe(
          tapResponse({
            next: (isAlarmOn) => patchState(store, { isAlarmOn }),
            error: () => console.log('Error getting alarm status'),
          })
        );
      }

      return {
        fetchInitData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              combineLatest([getAvgTemperature(), getAlarmStatus()]).pipe(
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setAlarm: rxMethod<boolean>(
          pipe(
            switchMap((isAlarmOn) =>
              alarmApiService.setAlarmMode({ body: { isActive: isAlarmOn } }).pipe(
                tap({
                  error: () => console.log('Error setting alarm'),
                }),
                switchMap(() => getAlarmStatus())
              )
            )
          )
        ),
      };
    }
  )
);
