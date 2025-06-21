import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AlarmApiService, HomeDeviceApiService } from '@sparrow-home/api';
import { LoaderService } from '@sparrow-home/core';
import { combineLatest, finalize, map, Observable, pipe, switchMap, tap } from 'rxjs';

interface MainPanelStoreState {
  avgTemperature: number | null;
  isAlarmOn: boolean;
  areAllWindowsAndDoorsClosed: boolean | null;
}

export const MainPanelStore = signalStore(
  { providedIn: 'root' },
  withState<MainPanelStoreState>({
    avgTemperature: null,
    isAlarmOn: false,
    areAllWindowsAndDoorsClosed: null,
  }),
  withMethods(
    (
      store,
      homeDeviceApiService = inject(HomeDeviceApiService),
      alarmApiService = inject(AlarmApiService),
      loaderService = inject(LoaderService),
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

      function getWindowsAndDoorStatus(): Observable<boolean | null> {
        return homeDeviceApiService.areAllDoorsAndWindowsClosed().pipe(
          tapResponse({
            next: (areAllWindowsAndDoorsClosed) => patchState(store, { areAllWindowsAndDoorsClosed }),
            error: () => console.log('Error getting windows and door status'),
          })
        );
      }

      return {
        fetchInitData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              combineLatest([getAvgTemperature(), getAlarmStatus(), getWindowsAndDoorStatus()]).pipe(
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setAlarm: rxMethod<boolean>(
          pipe(
            switchMap((isAlarmOn) =>
              alarmApiService.setAlarmMode({ body: { isActive: isAlarmOn } }).pipe(
                switchMap(() => getAlarmStatus())
              )
            )
          )
        ),
      };
    }
  )
);
