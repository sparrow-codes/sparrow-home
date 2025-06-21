import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  AquaPreferencesApiService,
  GetAquaPreferencesApiModel,
  GetCircularPumpPreferencesApiModel,
  HomeDeviceApiService,
  PanasonicCloudApiService,
} from '@sparrow-home/api';
import { DeviceType, LoaderService } from '@sparrow-home/core';
import { SelectOption } from '@sparrow-home/ui';
import { MessageService } from 'primeng/api';
import { combineLatest, finalize, first, map, Observable, pipe, switchMap, tap } from 'rxjs';

import { AquaPreferences } from '../model';
import { CircularPumpPreferences } from '../model/circular-pump-preferences';

interface AutomationStoreState {
  aquaPreferences: AquaPreferences | null;
  circularPumpPreferences: CircularPumpPreferences | null;
  switchDevicesOptions: SelectOption<string>[] | null;
}

export type AutomationStore = InstanceType<typeof automationStore>;

export const automationStore = signalStore(
  { providedIn: 'root' },
  withState<AutomationStoreState>({
    aquaPreferences: null,
    switchDevicesOptions: null,
    circularPumpPreferences: null,
  }),
  withMethods(
    (
      store,
      aquaApiService = inject(AquaPreferencesApiService),
      homeDeviceApiService = inject(HomeDeviceApiService),
      circularPumpApiService = inject(PanasonicCloudApiService),
      loaderService = inject(LoaderService),
      messageService = inject(MessageService)
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
            error: () => messageService.add({ summary: 'Błąd pobierania listy urząrzeń!', severity: 'error' }),
          })
        );
      }

      function _fetchAquaPreferences(): Observable<GetAquaPreferencesApiModel> {
        return aquaApiService.getAquaPreference().pipe(
          first(),
          tapResponse({
            next: (response) => {
              const aquaPreferences: AquaPreferences = new AquaPreferences();
              aquaPreferences.endTime = response.lightEndTime ? new Date(response.lightEndTime) : undefined;
              aquaPreferences.startTime = response.lightStartTime ? new Date(response.lightStartTime) : undefined;
              aquaPreferences.homeDeviceId = response.homeDeviceId;
              aquaPreferences.isActive = response.isActive;
              patchState(store, { aquaPreferences });
            },
            error: () => messageService.add({ summary: 'Błąd pobierania preferencji!', severity: 'error' }),
          })
        );
      }

      function _fetchCircularPumpPreferences(): Observable<GetCircularPumpPreferencesApiModel> {
        return circularPumpApiService.getCircularPumpPreferences().pipe(
          first(),
          tapResponse({
            next: (response) => {
              const circularPumpPreferences: CircularPumpPreferences = new CircularPumpPreferences();
              circularPumpPreferences.endTime = response.circularPumpEndTime
                ? new Date(response.circularPumpEndTime)
                : undefined;
              circularPumpPreferences.startTime = response.circularPumpStartTime
                ? new Date(response.circularPumpStartTime)
                : undefined;
              circularPumpPreferences.homeDeviceId = response.homeDeviceId;
              circularPumpPreferences.isActive = response.isActive;
              patchState(store, { circularPumpPreferences });
            },
            error: () => messageService.add({ summary: 'Błąd pobierania preferencji!', severity: 'error' }),
          })
        );
      }

      return {
        fetchInitialData: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              combineLatest([_fetchSwitchDevices(), _fetchAquaPreferences(), _fetchCircularPumpPreferences()]).pipe(
                first(),
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        setCircularPumpPreferences: rxMethod<CircularPumpPreferences>(
          pipe(
            switchMap((preferences) =>
              circularPumpApiService
                .setCircularPumpPreferences({
                  body: {
                    from: preferences.startTime?.toISOString(),
                    to: preferences.endTime?.toISOString(),
                    homeDeviceId: preferences.homeDeviceId,
                  },
                })
                .pipe(
                  tapResponse({
                    next: () => messageService.add({ summary: 'Pomyślnie zmieniono ustawienia', severity: 'contrast' }),
                    error: () => messageService.add({ summary: 'Błąd zmiany ustawień!', severity: 'error' }),
                  }),
                  first(),
                  switchMap(() => _fetchCircularPumpPreferences())
                )
            )
          )
        ),
        setAquaPreferences: rxMethod<AquaPreferences>(
          pipe(
            switchMap((preferences) =>
              aquaApiService
                .setAquaPreference({
                  body: {
                    from: preferences.startTime?.toISOString(),
                    to: preferences.endTime?.toISOString(),
                    homeDeviceId: preferences.homeDeviceId,
                  },
                })
                .pipe(
                  first(),
                  tapResponse({
                    next: () => messageService.add({ summary: 'Pomyślnie zmieniono ustawienia', severity: 'contrast' }),
                    error: () => messageService.add({ summary: 'Błąd zmiany ustawień!', severity: 'error' }),
                  }),
                  switchMap(() => _fetchAquaPreferences())
                )
            )
          )
        ),
        setAquaLightScheduler: rxMethod<boolean>(
          pipe(
            switchMap((isActive) =>
              aquaApiService.setAquaStatus({ body: { isActive } }).pipe(
                first(),
                tapResponse({
                  next: () => messageService.add({ summary: 'Pomyślnie zmieniono ustawienia', severity: 'contrast' }),
                  error: () => messageService.add({ summary: 'Błąd zmiany ustawień!', severity: 'error' }),
                })
              )
            )
          )
        ),
        setCircularPumpScheduler: rxMethod<boolean>(
          pipe(
            switchMap((isActive) =>
              circularPumpApiService.setCircularPumpStatus({ body: { isActive } }).pipe(
                first(),
                tapResponse({
                  next: () => messageService.add({ summary: 'Pomyślnie zmieniono ustawienia', severity: 'contrast' }),
                  error: () => messageService.add({ summary: 'Błąd zmiany ustawień!', severity: 'error' }),
                })
              )
            )
          )
        ),
      };
    }
  )
);
