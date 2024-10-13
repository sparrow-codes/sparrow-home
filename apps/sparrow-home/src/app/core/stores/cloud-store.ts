import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { delay, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

import { CloudApiService } from '~api/cloud/cloud-api.service';
import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';

interface CloudState {
  isLoading: boolean;
  heatPump: GetHeatPumpDetailsResponse | null;
}

export const CloudStore = signalStore(
  { providedIn: 'root' },
  withState<CloudState>({ heatPump: null, isLoading: false }),
  withMethods((store, cloudApiService = inject(CloudApiService), toastMessage = inject(SpToastService)) => {
    const getHeatPumpDetails: () => Observable<GetHeatPumpDetailsResponse> = () =>
      cloudApiService.getHeatPumpDetails().pipe(
        tapResponse({
          next: (value) => patchState(store, { heatPump: value }),
          error: () => toastMessage.danger('Błąd', 'Wystąpił błąd w połączeniu do cloud!'),
        })
      );

    return {
      getHeatPumpDetails: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => getHeatPumpDetails().pipe(finalize(() => patchState(store, { isLoading: false }))))
        )
      ),
      changeOperationsStatus: rxMethod<{ isWaterOn: boolean; isHeatOn: boolean }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((request) =>
            cloudApiService.changeOperationsStatus({ ...request, deviceGuid: store.heatPump()?.deviceGuid ?? '' }).pipe(
              delay(3000),
              switchMap(() => getHeatPumpDetails()),
              finalize(() => patchState(store, { isLoading: false }))
            )
          )
        )
      ),
    };
  })
);
