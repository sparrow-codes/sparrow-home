import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  AlarmApiService,
  GetAlarmModeResponseApiModel,
  GetAllDoorAndWindowsStatusApiModel,
  HomeDeviceApiService,
  HomeDeviceDetailsDtoApiModel,
} from '@sparrow-home/api';
import { LoaderService } from '@sparrow-home/core';
import { HomeDevice, toHomeDevice } from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, first, forkJoin, map, Observable, pipe, switchMap, tap } from 'rxjs';

interface MainPanelStoreState {
  avgTemperature: number | null;
  isAlarmOn: boolean;
  isAlarmAvailable: boolean;
  areAllWindowsAndDoorsClosed: boolean | null;
  mainPageDevices: HomeDevice[];
}

export type MainPanelStore = InstanceType<typeof mainPanelStore>;

export const mainPanelStore = signalStore(
  { providedIn: 'root' },
  withState<MainPanelStoreState>({
    avgTemperature: null,
    isAlarmOn: false,
    isAlarmAvailable: false,
    areAllWindowsAndDoorsClosed: null,
    mainPageDevices: [],
  }),
  withMethods(
    (
      store,
      homeDeviceApiService = inject(HomeDeviceApiService),
      alarmApiService = inject(AlarmApiService),
      loaderService = inject(LoaderService),
      messageService = inject(MessageService)
    ) => {
      function getAvgTemperature(): Observable<number> {
        return homeDeviceApiService.getHomeAvgTemperature().pipe(
          map((res) => res.avgTemperature),
          tapResponse({
            next: (temperature) => patchState(store, { avgTemperature: temperature }),
            error: () => messageService.add({ summary: 'Błąd pobierania średniej temperatury', severity: 'error' }),
          })
        );
      }

      function getAlarmStatus(): Observable<GetAlarmModeResponseApiModel> {
        return alarmApiService.getAlarmMode().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { isAlarmOn: response.isActive, isAlarmAvailable: response.isAvailable }),
            error: () => messageService.add({ summary: 'Błąd pobierania statusu alarmu', severity: 'error' }),
          })
        );
      }

      function getWindowsAndDoorStatus(): Observable<GetAllDoorAndWindowsStatusApiModel> {
        return homeDeviceApiService.areAllDoorsAndWindowsClosed().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { areAllWindowsAndDoorsClosed: response.areAllDoorsAndWindowsClosed }),
            error: () => messageService.add({ summary: 'Błąd pobierania statusu okien i drzwi', severity: 'error' }),
          })
        );
      }

      function getMainDevices(): Observable<HomeDeviceDetailsDtoApiModel[]> {
        return homeDeviceApiService.getAllDevices({ body: { isOnMainPage: true } }).pipe(
          tapResponse({
            error: () => messageService.add({ summary: 'Błąd pobierania listy urządzeń' }),
            next: (devices) => patchState(store, { mainPageDevices: devices.map(toHomeDevice) }),
          })
        );
      }

      return {
        fetchInitData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              forkJoin([getAvgTemperature(), getAlarmStatus(), getWindowsAndDoorStatus(), getMainDevices()]).pipe(
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setAlarm: rxMethod<boolean>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((isAlarmOn) =>
              alarmApiService.setAlarmMode({ body: { isActive: isAlarmOn } }).pipe(
                first(),
                tapResponse({
                  next: () => {
                    if (isAlarmOn) {
                      messageService.add({ summary: 'Alarm aktywny!', severity: 'success' });
                    } else {
                      messageService.add({ summary: 'Alarm wyłączony!', severity: 'success' });
                    }
                  },
                  error: () => messageService.add({ summary: 'Błąd podczas ustawiania alarmu!', severity: 'error' }),
                }),
                switchMap(() => getAlarmStatus().pipe(finalize(() => (loaderService.showLoader = false))))
              )
            )
          )
        ),
        publishEvent: rxMethod<{ id: number; payload: Record<string, unknown> }>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((request) =>
              homeDeviceApiService
                .publishZigbeeEvent({
                  body: { deviceId: request.id.toString(), payload: request.payload },
                })
                .pipe(
                  tapResponse({
                    error: () => messageService.add({ summary: 'Nie udało się wysłać zdarzenia!', severity: 'error' }),
                    next: () => messageService.add({ summary: 'Akcja wywoałana pomyślnie!', severity: 'success' }),
                  }),
                  finalize(() => (loaderService.showLoader = false))
                )
            )
          )
        ),
      };
    }
  )
);
