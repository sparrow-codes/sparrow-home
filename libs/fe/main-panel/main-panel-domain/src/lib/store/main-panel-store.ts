import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
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
  noDevices: boolean | null;
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
    noDevices: null,
  }),
  withMethods(
    (
      store,
      homeDeviceApiService = inject(HomeDeviceApiService),
      alarmApiService = inject(AlarmApiService),
      loaderService = inject(LoaderService),
      messageService = inject(MessageService),
      translateService = inject(TranslateService)
    ) => {
      function getAvgTemperature(): Observable<number> {
        return homeDeviceApiService.getHomeAvgTemperature().pipe(
          map((res) => res.avgTemperature),
          tapResponse({
            next: (temperature) => patchState(store, { avgTemperature: temperature }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_avg_temperature_error'),
                severity: 'error',
              }),
          })
        );
      }

      function getAlarmStatus(): Observable<GetAlarmModeResponseApiModel> {
        return alarmApiService.getAlarmMode().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { isAlarmOn: response.isActive, isAlarmAvailable: response.isAvailable }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_alarm_status_error'),
                severity: 'error',
              }),
          })
        );
      }

      function getWindowsAndDoorStatus(): Observable<GetAllDoorAndWindowsStatusApiModel> {
        return homeDeviceApiService.areAllDoorsAndWindowsClosed().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { areAllWindowsAndDoorsClosed: response.areAllDoorsAndWindowsClosed }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_windows_doors_status_error'),
                severity: 'error',
              }),
          })
        );
      }

      function getMainDevices(): Observable<HomeDeviceDetailsDtoApiModel[]> {
        return homeDeviceApiService.getAllDevices({ body: { deviceType: undefined } }).pipe(
          tapResponse({
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_devices_error'),
                severity: 'error',
              }),
            next: (devices) => {
              patchState(store, {
                mainPageDevices: devices.filter((device) => device.isOnMainPage).map(toHomeDevice),
                noDevices: devices.length === 0,
              });
            },
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
                      messageService.add({
                        summary: translateService.instant('main_panel.alarm_activated'),
                        severity: 'success',
                      });
                    } else {
                      messageService.add({
                        summary: translateService.instant('main_panel.alarm_deactivated'),
                        severity: 'success',
                      });
                    }
                  },
                  error: () =>
                    messageService.add({
                      summary: translateService.instant('main_panel.set_alarm_error'),
                      severity: 'error',
                    }),
                }),
                switchMap(() => getAlarmStatus().pipe(finalize(() => (loaderService.showLoader = false))))
              )
            )
          )
        ),
        publishEvent: rxMethod<{ id: string; payload: Record<string, unknown> }>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((request) =>
              homeDeviceApiService
                .publishZigbeeEvent({
                  body: { deviceId: request.id, payload: request.payload },
                })
                .pipe(
                  tapResponse({
                    error: () =>
                      messageService.add({
                        summary: translateService.instant('main_panel.publish_event_error'),
                        severity: 'error',
                      }),
                    next: () =>
                      messageService.add({
                        summary: translateService.instant('main_panel.publish_event_success'),
                        severity: 'success',
                      }),
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
