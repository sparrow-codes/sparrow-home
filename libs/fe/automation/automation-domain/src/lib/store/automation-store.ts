import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AquaPreferencesApiService, GetAquaPreferencesApiModel, HomeDeviceApiService } from '@sparrow-home/api';
import { DeviceType, LoaderService } from '@sparrow-home/core';
import { SelectOption } from '@sparrow-home/ui';
import { combineLatest, finalize, first, map, Observable, pipe, switchMap, tap } from 'rxjs';

import { AquaPreferences } from '../model';

interface AutomationStoreState {
  aquaPreferences: AquaPreferences | null;
  switchDevicesOptions: SelectOption<string>[] | null;
}

export type AutomationStore = InstanceType<typeof automationStore>;

export const automationStore = signalStore(
  { providedIn: 'root' },
  withState<AutomationStoreState>({
    aquaPreferences: null,
    switchDevicesOptions: null,
  }),
  withMethods(
    (
      store,
      aquaApiService = inject(AquaPreferencesApiService),
      homeDeviceApiService = inject(HomeDeviceApiService),
      loaderService = inject(LoaderService)
    ) => {
      function _fetchSwitchDevices(): Observable<SelectOption<string>[]> {
        return homeDeviceApiService.getAllDevices({ deviceType: DeviceType.POWER_PLUG }).pipe(
          first(),
          map((response) =>
            response.map((device) => ({
              value: device.homeDeviceId,
              label: device.name,
            }))
          ),
          tapResponse({
            next: (devices) => patchState(store, { switchDevicesOptions: devices }),
            error: () => console.log('error'),
          })
        );
      }

      function _fetchPreferences(): Observable<GetAquaPreferencesApiModel> {
        return aquaApiService.getAquaPreference().pipe(
          first(),
          tapResponse({
            next: (response) => {
              const aquaPreferences: AquaPreferences = new AquaPreferences();
              aquaPreferences.lightEndTime = response.lightEndTime ? new Date(response.lightEndTime) : undefined;
              aquaPreferences.lightStartTime = response.lightStartTime ? new Date(response.lightStartTime) : undefined;
              aquaPreferences.homeDeviceId = response.homeDeviceId;
              aquaPreferences.isActive = response.isActive;
              patchState(store, { aquaPreferences });
            },
            error: () => console.log('error'),
          })
        );
      }

      return {
        fetchInitialData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              combineLatest([_fetchSwitchDevices(), _fetchPreferences()]).pipe(first(), finalize(() => loaderService.showLoader = false))
            ),
          )
        ),
        setPreferences: rxMethod<AquaPreferences>(
          pipe(
            switchMap((preferences) =>
              aquaApiService
                .setAquaPreference({
                  body: {
                    from: preferences.lightStartTime?.toISOString(),
                    to: preferences.lightEndTime?.toISOString(),
                    homeDeviceId: preferences.homeDeviceId,
                  },
                })
                .pipe(
                  first(),
                  switchMap(() => _fetchPreferences())
                )
            )
          )
        ),
        setAquaLightScheduler: rxMethod<boolean>(
          pipe(switchMap((isActive) => aquaApiService.setAquaStatus({ body: { isActive } }).pipe(first())))
        ),
      };
    }
  )
);
