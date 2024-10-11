import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { finalize, first, pipe, switchMap, tap } from 'rxjs';

import { CloudConnectionService } from '~api/cloud/cloud-connection.service';
import { HeatPump } from '~api/cloud/models/panasonic-cloud-models';
import { DeviceApiService } from '~api/device/device-api.service';
import { WeatherApiService } from '~api/weather/weather-api.service';

type RootState = {
  loading: boolean;
  heatPump: HeatPump | null;
  lowestTemperatureAtNight: number | undefined;
};

export const RootStore = signalStore(
  { providedIn: 'root' },
  withState<RootState>({
    connecting: true,
    loading: false,
    heatPump: null,
    isUserLoggedIn: false,
    lowestTemperatureAtNight: undefined,
  } as RootState),
  withMethods(
    (
      store,
      cloudConnectionService = inject(CloudConnectionService),
      messageService = inject(SpToastService),
      deviceApiService = inject(DeviceApiService),
      weatherApiService = inject(WeatherApiService),
      toastService = inject(SpToastService)
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
                error: () => messageService.danger('Błąd', 'Wystąpił błąd w połączeniu do cloud!'),
              }),
              finalize(() => patchState(store, { loading: false }))
            )
          )
        )
      ),
      fetchDeviceList: rxMethod<void>(pipe(switchMap(() => deviceApiService.getWifiDeviceList().pipe()))),
      fetchLowestTemperature: rxMethod<void>(
        pipe(
          switchMap(() =>
            weatherApiService.getLowestTemperatureByNight().pipe(
              tapResponse({
                next: (temperature) => patchState(store, { lowestTemperatureAtNight: temperature }),
                error: () => toastService.danger('Pogoda', 'Błąd pobierania nocnej temperatury'),
              })
            )
          )
        )
      ),
    })
  )
);
