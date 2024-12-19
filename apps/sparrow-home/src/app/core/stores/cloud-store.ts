import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

import { CloudApiService } from '~api/cloud/cloud-api.service';
import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';
import { GetScheduleWaterHeatingResponse } from '~api/cloud/models/get-schedule-water-heating.response';
import { WaterTankOptions } from '~core/models/water-tank-options';
import { LoaderService } from '~ui/services/loader.service';

interface CloudState {
  heatPump: GetHeatPumpDetailsResponse | null;
  waterTankOptions: WaterTankOptions | null;
}

export const CloudStore = signalStore(
  { providedIn: 'root' },
  withState<CloudState>({ heatPump: null, waterTankOptions: null }),
  withMethods(
    (
      store,
      cloudApiService = inject(CloudApiService),
      snackBar = inject(MatSnackBar),
      loaderService = inject(LoaderService)
    ) => {
      const _getHeatPumpDetails: () => Observable<GetHeatPumpDetailsResponse> = () =>
        cloudApiService.getHeatPumpDetails().pipe(
          tapResponse({
            next: (value) => patchState(store, { heatPump: { ...value } }),
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

      return {
        getHeatPumpDetails: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              _getHeatPumpDetails().pipe(
                switchMap(() => _getScheduledWaterHeatStatus()),
                finalize(() => (loaderService.showLoader = false))
              )
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
      };
    }
  )
);
