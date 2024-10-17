import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { delay, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

import { CloudApiService } from '~api/cloud/cloud-api.service';
import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';
import { GetScheduleWaterHeatingResponse } from '~api/cloud/models/get-schedule-water-heating.response';
import { WaterTankOptions } from '~core/models/water-tank-options';

interface CloudState {
  isLoading: boolean;
  heatPump: GetHeatPumpDetailsResponse | null;
  waterTankOptions: WaterTankOptions | null;
}

export const CloudStore = signalStore(
  { providedIn: 'root' },
  withState<CloudState>({ heatPump: null, isLoading: false, waterTankOptions: null }),
  withMethods((store, cloudApiService = inject(CloudApiService), toastMessage = inject(SpToastService)) => {
    const _getHeatPumpDetails: () => Observable<GetHeatPumpDetailsResponse> = () =>
      cloudApiService.getHeatPumpDetails().pipe(
        tapResponse({
          next: (value) => patchState(store, { heatPump: { ...value } }),
          error: () => toastMessage.danger('Błąd', 'Wystąpił błąd w połączeniu do cloud!'),
        })
      );

    const _getScheduledWaterHeatStatus: () => Observable<GetScheduleWaterHeatingResponse> = () =>
      cloudApiService.getScheduledWaterHeatingStatus().pipe(
        tapResponse({
          next: (response) =>
            patchState(store, { waterTankOptions: { isScheduledHeating: response.isScheduled } as WaterTankOptions }),
          error: () => toastMessage.danger('Konfiguracja', 'Błąd pobierania szczegółów harmonogramu grzania wody'),
        })
      );

    return {
      getHeatPumpDetails: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            _getHeatPumpDetails().pipe(
              switchMap(() => _getScheduledWaterHeatStatus()),
              finalize(() => patchState(store, { isLoading: false }))
            )
          )
        )
      ),
      changeOperationsStatus: rxMethod<{ isWaterOn: boolean; isHeatOn: boolean }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((request) =>
            cloudApiService.changeOperationsStatus({ ...request, deviceGuid: store.heatPump()?.deviceGuid ?? '' }).pipe(
              delay(7000),
              switchMap(() => _getHeatPumpDetails())
            )
          )
        )
      ),
      setWaterHeatingStatus: rxMethod<boolean>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((isActive) =>
            cloudApiService.scheduleWaterHeating({ active: isActive }).pipe(
              tapResponse({
                next: () => toastMessage.success('Konfiguracja', 'Pomyślnie zmieniono ustawienie grzania wody'),
                error: () => toastMessage.danger('Konfiguracja', 'Błąd podczas zmiany ustawień grzania wody!'),
              }),
              switchMap(() => _getScheduledWaterHeatStatus()),
              finalize(() => patchState(store, { isLoading: false }))
            )
          )
        )
      ),
    };
  })
);
