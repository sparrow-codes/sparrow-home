import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HeatPump } from '@shared-models/panasonic-cloud-models';
import { MessageService } from 'primeng/api';
import { finalize, first, pipe, switchMap, tap } from 'rxjs';

import { CloudConnectionService } from '../../api/cloud/cloud-connection.service';
import { DeviceApiService } from '../../api/device/device-api.service';

type RootState = {
  loading: boolean;
  heatPump: HeatPump | null;
};

export const RootStore = signalStore(
  { providedIn: 'root' },
  withState<RootState>({ connecting: true, loading: false, heatPump: null } as RootState),
  withMethods(
    (
      store,
      cloudConnectionService = inject(CloudConnectionService),
      messageService = inject(MessageService),
      deviceApiService = inject(DeviceApiService)
    ) => ({
      connectToCloud: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            cloudConnectionService.getPanasonicCloundConnection().pipe(
              first(),
              switchMap(() => cloudConnectionService.getHeatPumpDetails().pipe(first())),
              tapResponse({
                next: (value) => patchState(store, { heatPump: value }),
                error: (error: HttpErrorResponse) => messageService.add({ detail: error.message, severity: 'error' }),
              }),
              finalize(() => patchState(store, { loading: false }))
            )
          )
        )
      ),
      fetchDeviceList: rxMethod<void>(pipe(switchMap(() => deviceApiService.getWifiDeviceList().pipe()))),
    })
  )
);
