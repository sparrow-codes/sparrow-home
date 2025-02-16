import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  CloudApiService,
  GetCircularPumpPreferencesResponse,
  GetHeatingPreferencesResponse,
  GetHeatPumpDetailsResponse,
  GetScheduleWaterHeatingResponse,
  HomeDeviceApiModel,
  HomeDeviceApiService,
} from '@sparrow-home/api';
import { DeviceType, LoaderService } from '@sparrow-home/core';
import { SelectOption } from '@sparrow-home/ui';
import { combineLatest, delay, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

import { CircularPreferencesPumpMapper } from '../mapper/circular-preferences-pump.mapper';
import { HeatPumpMapper } from '../mapper/heat-pump.mapper';
import { HeatingPreferencesMapper } from '../mapper/heating-preferences.mapper';
import { CircularPumpPreferences, HeatingPreferences, HeatPump, WaterTankOptions } from '../models';

interface CloudState {
  heatPump: HeatPump | null;
  waterTankOptions: WaterTankOptions | null;
  circularPumpPreferences: CircularPumpPreferences | null;
  homeDeviceOptions: { value: string; label: string }[] | null;
  heatingPreferences: HeatingPreferences | null;
  temperatureSensorsOptions: SelectOption<number>[] | null;
}

export const CloudStore = signalStore(
  { providedIn: 'root' },
  withState<CloudState>({
    heatPump: null,
    waterTankOptions: null,
    circularPumpPreferences: null,
    homeDeviceOptions: null,
    heatingPreferences: null,
    temperatureSensorsOptions: null,
  }),
  withMethods(
    (
      store,
      cloudApiService = inject(CloudApiService),
      snackBar = inject(MatSnackBar),
      loaderService = inject(LoaderService),
      homeDeviceApiService = inject(HomeDeviceApiService)
    ) => {
      const _getHeatPumpDetails: () => Observable<GetHeatPumpDetailsResponse> = () =>
        cloudApiService.getHeatPumpDetails().pipe(
          tapResponse({
            next: (response) => patchState(store, { heatPump: HeatPumpMapper.map(response) }),
            error: () => snackBar.open('Błąd: Wystąpił błąd w połączeniu do cloud!', 'Zamknij'),
          })
        );

      const _getScheduledWaterHeatStatus: () => Observable<GetScheduleWaterHeatingResponse> = () =>
        cloudApiService.getScheduledWaterHeatingStatus().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { waterTankOptions: { isScheduledHeating: response.isScheduled } as WaterTankOptions }),
            error: () => snackBar.open('Błąd pobierania szczegółów harmonogramu grzania wody', 'Zamknij'),
          })
        );

      const _getCircularPumpPreferencesResponse: () => Observable<GetCircularPumpPreferencesResponse> = () =>
        cloudApiService.getCircularPumpPreferences().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, { circularPumpPreferences: CircularPreferencesPumpMapper.map(response) }),
            error: () => snackBar.open('Błąd pobierania szczegółów pompy cyrkulacyjnej'),
          })
        );

      const _getHeatPreferences: () => Observable<GetHeatingPreferencesResponse> = () =>
        cloudApiService.getHeatingPreferences().pipe(
          tapResponse({
            next: (response) => patchState(store, { heatingPreferences: HeatingPreferencesMapper.map(response) }),
            error: () => snackBar.open('Błąd pobierania szczegółów pompy cyrkulacyjnej'),
          })
        );

      const _getHomeDeviceOptions: () => Observable<HomeDeviceApiModel[]> = () =>
        homeDeviceApiService.getAll().pipe(
          tapResponse({
            next: (deviceList) =>
              patchState(store, {
                homeDeviceOptions: deviceList
                  .filter((device) => device.type === DeviceType.POWER_PLUG)
                  .map((device) => ({
                    value: device.homeDeviceId,
                    label: device.name,
                  })),
                temperatureSensorsOptions: deviceList
                  .filter((device) => device.type === DeviceType.TEMPERATURE_SENSOR)
                  .map((device) => ({
                    value: device.id,
                    label: device.name,
                  })),
              }),
            error: () => snackBar.open('Błąd pobierania listy urządzeń!'),
          })
        );

      return {
        fetchInitData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              combineLatest([
                _getHeatPumpDetails(),
                _getScheduledWaterHeatStatus(),
                _getCircularPumpPreferencesResponse(),
                _getHomeDeviceOptions(),
                _getHeatPreferences(),
              ]).pipe(finalize(() => (loaderService.showLoader = false)))
            )
          )
        ),
        changeOperationsStatus: rxMethod<{ isWaterOn: boolean; isHeatOn: boolean }>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((request) =>
              cloudApiService
                .changeOperationsStatus({ ...request, deviceGuid: store.heatPump()?.deviceGuid ?? '' })
                .pipe(
                  delay(10000),
                  switchMap(() => _getHeatPumpDetails()),
                  finalize(() => (loaderService.showLoader = false))
                )
            )
          )
        ),
        setWaterHeatingStatus: rxMethod<boolean>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((isActive) =>
              cloudApiService.scheduleWaterHeating({ active: isActive }).pipe(
                tapResponse({
                  next: () => snackBar.open('Pomyślnie zmieniono ustawienie grzania wody', 'Zamknij'),
                  error: () => snackBar.open('Błąd podczas zmiany ustawień grzania wody!', 'Zamknij'),
                }),
                switchMap(() => _getScheduledWaterHeatStatus()),
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setCircularPumpPreferences: rxMethod<CircularPumpPreferences>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((preferences) =>
              cloudApiService
                .setCircularPumpPreferences({
                  from: preferences.scheduledStartTime,
                  to: preferences.scheduledEndTime,
                  homeDeviceId: preferences.homeDeviceId,
                })
                .pipe(
                  tapResponse({
                    next: () => snackBar.open('Pomyślnie zmieniono ustawienia'),
                    error: () => snackBar.open('Błąd zmiany ustawień pompy cyrkulacyjnej'),
                  }),
                  switchMap(() => _getCircularPumpPreferencesResponse()),
                  finalize(() => (loaderService.showLoader = false))
                )
            )
          )
        ),

        setCircularPumpScheduleStatus: rxMethod<boolean>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((isActive) =>
              cloudApiService.setCircularPumpScheduleStatus(isActive).pipe(
                tapResponse({
                  next: () => snackBar.open(isActive ? 'Harmonogram aktywny' : 'Harmonogram wyłączony'),
                  error: () => snackBar.open('Błąd uruchamiania harmonogramu pompy cyrkulacyjnej'),
                }),
                switchMap(() => _getCircularPumpPreferencesResponse()),
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setHeatPreferences: rxMethod<HeatingPreferences>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((preferences) =>
              cloudApiService
                .setHeatingPreferences({
                  maxTargetTemperature: preferences.maxTargetTemperature,
                  groundFlorSensorId: preferences.groundFlorTemperatureSensorId,
                  minTargetTemperature: preferences.minTargetTemperature,
                  firstFlorSensorId: preferences.firstFlorTemperatureSensorId,
                })
                .pipe(
                  switchMap(() => _getHeatPreferences()),
                  tapResponse({
                    next: () => snackBar.open('Pomyślnie zmieniono ustawienia'),
                    error: () => snackBar.open('Błąd zmiany ustawień'),
                  }),
                  finalize(() => (loaderService.showLoader = false))
                )
            )
          )
        ),
        activateAutomaticHeating: rxMethod<boolean>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((isActive) =>
              cloudApiService.setAutomaticHeating(isActive).pipe(
                tapResponse({
                  next: () => snackBar.open('Automatyczne ogrzewanie aktywne!'),
                  error: () => snackBar.open('Błąd podczas włączania automatycznego ogrzewania'),
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
