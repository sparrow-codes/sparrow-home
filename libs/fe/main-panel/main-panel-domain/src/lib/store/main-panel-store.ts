import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import {
  AlarmApiService,
  GetAlarmModeResponseApiModel,
  GetAllDoorAndWindowsStatusApiModel,
  HomeDeviceApiService,
  HomeDeviceDetailsDtoApiModel,
} from '@sparrow-home/api';
import {
  HomeDevice,
  toHomeDevice,
  withFetching,
  withLoading,
  withoutLoading,
  withoutRefreshing,
  withRefreshing,
  withRefreshingObjects,
} from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, first, forkJoin, map, Observable, pipe, switchMap, tap } from 'rxjs';

import { withVacationMode } from '../features/vacation-mode';

interface MainPanelStoreState {
  haveInitialData: boolean;
  avgTemperature: number | null;
  isAlarmOn: boolean;
  isAlarmAvailable: boolean;
  areAllWindowsAndDoorsClosed: boolean | null;
  mainPageDevices: HomeDevice[];
  nrOfDevices: number | null;
}

export type MainPanelStore = InstanceType<typeof mainPanelStore>;

// eslint-disable-next-line @typescript-eslint/typedef
export const mainPanelStore = signalStore(
  { providedIn: 'root' },
  withState<MainPanelStoreState>({
    haveInitialData: false,
    avgTemperature: null,
    isAlarmOn: false,
    isAlarmAvailable: false,
    areAllWindowsAndDoorsClosed: null,
    mainPageDevices: [],
    nrOfDevices: null,
  }),
  withVacationMode(),
  withFetching(),
  withRefreshingObjects<string>(),
  withComputed((store) => ({
    noDevices: computed(() => store.nrOfDevices() === 0),
  })),
  withProps(
    (
      store,
      homeDeviceApiService = inject(HomeDeviceApiService),
      alarmApiService = inject(AlarmApiService),
      messageService = inject(MessageService),
      translateService = inject(TranslateService)
    ) => ({
      _homeDeviceApiService: homeDeviceApiService,
      _alarmApiService: alarmApiService,
      _messageService: messageService,
      _translateService: translateService,
      _getAvgTemperature: (): Observable<number> =>
        homeDeviceApiService.getHomeAvgTemperature().pipe(
          map((res) => res.avgTemperature),
          tapResponse({
            next: (temperature) => patchState(store, { avgTemperature: temperature }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_avg_temperature_error'),
                severity: 'error',
              }),
          })
        ),
      _getAlarmStatus: (): Observable<GetAlarmModeResponseApiModel> =>
        alarmApiService.getAlarmMode().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { isAlarmOn: response.isActive, isAlarmAvailable: response.isAvailable }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_alarm_status_error'),
                severity: 'error',
              }),
          })
        ),
      _getWindowsAndDoorStatus: (): Observable<GetAllDoorAndWindowsStatusApiModel> =>
        homeDeviceApiService.areAllDoorsAndWindowsClosed().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { areAllWindowsAndDoorsClosed: response.areAllDoorsAndWindowsClosed }),
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_windows_doors_status_error'),
                severity: 'error',
              }),
          })
        ),
      _getMainDevices: (): Observable<HomeDeviceDetailsDtoApiModel[]> =>
        homeDeviceApiService.getAllDevices({ body: { deviceType: undefined } }).pipe(
          tapResponse({
            error: () =>
              messageService.add({
                summary: translateService.instant('main_panel.fetch_devices_error'),
                severity: 'error',
              }),
            next: (devices) => {
              patchState(store, {
                mainPageDevices: devices.filter((device) => device.isOnMainPage).map(toHomeDevice),
                nrOfDevices: devices.length,
              });
            },
          })
        ),
    })
  ),
  withMethods((store) => ({
    fetchInitData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, store.haveInitialData() ? withRefreshing() : withLoading());
        }),
        switchMap(() =>
          forkJoin([
            store._getAvgTemperature(),
            store._getAlarmStatus(),
            store._getWindowsAndDoorStatus(),
            store._getMainDevices(),
            store._getVacationMode(),
          ]).pipe(finalize(() => patchState(store, withoutLoading(), withoutRefreshing(), { haveInitialData: true })))
        )
      )
    ),
    setAlarm: rxMethod<boolean>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
        switchMap((isAlarmOn) =>
          store._alarmApiService.setAlarmMode({ body: { isActive: isAlarmOn } }).pipe(
            first(),
            tapResponse({
              next: () =>
                store._messageService.add({
                  summary: store._translateService.instant(
                    isAlarmOn ? 'main_panel.alarm_activated' : 'main_panel.alarm_deactivated'
                  ),
                  severity: 'contrast',
                }),
              error: () =>
                store._messageService.add({
                  summary: store._translateService.instant('main_panel.set_alarm_error'),
                  severity: 'error',
                }),
            }),
            switchMap(() => store._getAlarmStatus().pipe(finalize(() => patchState(store, withoutRefreshing()))))
          )
        )
      )
    ),
    publishEvent: rxMethod<{ id: string; payload: Record<string, unknown> }>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
        switchMap((request) =>
          store._homeDeviceApiService
            .publishZigbeeEvent({ body: { deviceId: request.id, payload: request.payload } })
            .pipe(
              tapResponse({
                error: () =>
                  store._messageService.add({
                    summary: store._translateService.instant('main_panel.publish_event_error'),
                    severity: 'error',
                  }),
                next: () => store._refreshObject(request.id),
              }),
              finalize(() => patchState(store, withoutRefreshing()))
            )
        )
      )
    ),
    setVacationMode: rxMethod<boolean>(
      pipe(
        tap(() => patchState(store, withRefreshing())),
        switchMap((isVacationMode) =>
          store._setVacationMode(isVacationMode).pipe(
            switchMap(() => store._getVacationMode()),
            finalize(() => patchState(store, withoutRefreshing()))
          )
        )
      )
    ),
  }))
);
