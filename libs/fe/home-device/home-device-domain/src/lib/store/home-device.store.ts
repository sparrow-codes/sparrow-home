import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { addEntity, removeEntity, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { RoutePath } from '@sparrow-home/core';
import {
  HomeDevice,
  toHomeDevice,
  withFetching,
  withLoading,
  withoutLoading,
  withoutRefreshing,
  withRefreshing,
} from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { finalize, pipe, switchMap, tap } from 'rxjs';

import { DeviceSettings } from '../model';
import { homeDeviceDefaultState } from './default-state/home-device-default-state';
import { withApi } from './features/api';
import { HomeDeviceState } from './model/home-device-state';
import {
  withDeviceDetails,
  withDevicePaired,
  withDevices,
  withDeviceType,
  withNoDevices,
  withSearchQuery,
} from './state-updateters/state-updateters';

export type HomeDeviceStore = InstanceType<typeof HomeDeviceStore>;

export const HomeDeviceStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState<HomeDeviceState>(homeDeviceDefaultState),
  withEntities<HomeDevice>(),
  withProps(() => ({
    _homeDeviceSort: (device1: HomeDevice, device2: HomeDevice): number => {
      {
        if (device1.name > device2.name) {
          return 1;
        }

        if (device1.name < device2.name) {
          return -1;
        }

        return 0;
      }
    },
  })),
  withFetching(),
  withApi(),
  withComputed((store) => ({
    homeDevices: computed(() =>
      store.entities().filter((device) => device.name.toUpperCase().includes(store.searchQuery().toUpperCase()))
    ),
  })),
  withMethods(
    (
      store,
      messageService = inject(MessageService),
      translateService = inject(TranslateService),
      router = inject(Router)
    ) => ({
      setSearchQuery: (query: string): void => patchState(store, withSearchQuery(query)),
      setDeviceType: (deviceType: number | undefined): void => patchState(store, withDeviceType(deviceType)),
      fetchDevices: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, withDevicePaired(null), store.entities().length ? withRefreshing() : withLoading());
          }),
          switchMap(() =>
            store._fetchDevices().pipe(
              tapResponse({
                next: (devices) =>
                  patchState(
                    store,
                    setAllEntities(devices.map(toHomeDevice).sort(store._homeDeviceSort)),
                    devices.length ? withDevices() : withNoDevices()
                  ),
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.fetch_devices_error'),
                    severity: 'error',
                  }),
              }),
              finalize(() => patchState(store, withoutLoading(), withoutRefreshing()))
            )
          )
        )
      ),
      fetchDeviceDetails: rxMethod<number>(
        pipe(
          tap(() => patchState(store, withLoading(), withDeviceDetails(null))),
          switchMap((id) => store._fetchDeviceDetails(id).pipe(finalize(() => patchState(store, withoutLoading()))))
        )
      ),
      updateDeviceMainFields: rxMethod<{ id: string; settings: DeviceSettings }>(
        pipe(
          tap(() => patchState(store, withRefreshing())),
          switchMap((data) =>
            store._updateDeviceMainFields(data).pipe(
              switchMap(() => store._fetchDeviceDetails(+data.id)),
              tapResponse({
                next: () => void 0,
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.update_fields_error'),
                    severity: 'error',
                  }),
              }),
              finalize(() => patchState(store, withoutRefreshing()))
            )
          )
        )
      ),
      publishZigbeeEvent: rxMethod<{ deviceId: string; payload: Record<string, unknown> }>(
        pipe(
          tap(() => patchState(store, withRefreshing())),
          switchMap((data) =>
            store._publishZigbeeEvent(data).pipe(
              tapResponse({
                next: () => void 0,
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.error_sending_event'),
                    severity: 'error',
                  }),
              }),
              finalize(() => patchState(store, withoutRefreshing()))
            )
          )
        )
      ),
      changeDeviceName: rxMethod<{ id: number; deviceName: string }>(
        pipe(
          tap((data) =>
            patchState(
              store,
              withRefreshing(),
              updateEntity({ id: data.id, changes: { name: data.deviceName } }),
              withDeviceDetails({ ...(store.deviceDetails() as HomeDevice), name: data.deviceName })
            )
          ),
          switchMap((data) =>
            store._changeDeviceName(data).pipe(
              switchMap(() => store._fetchDeviceDetails(data.id)),
              tapResponse({
                next: () => void 0,
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.name_change_error'),
                    severity: 'error',
                  }),
              }),
              finalize(() => patchState(store, withoutRefreshing()))
            )
          )
        )
      ),
      createDevice: rxMethod<{ deviceType: number; name: string }>(
        pipe(
          tap(() => patchState(store, withRefreshing())),
          switchMap((data) =>
            store._createDevice(data).pipe(
              tapResponse({
                next: (id) => {
                  const isCreated: boolean = id !== null;

                  messageService.add({
                    summary: isCreated
                      ? translateService.instant('home.connection_established')
                      : translateService.instant('home.connection_not_established'),
                    severity: isCreated ? 'success' : 'contrast',
                  });

                  patchState(store, withDevicePaired(isCreated));

                  if (isCreated) {
                    patchState(store, addEntity({ type: data.deviceType, id, name: data.name } as HomeDevice));
                  }
                },
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.device_pairing_failed'),
                    severity: 'error',
                  }),
              }),
              finalize(() => patchState(store, withoutRefreshing()))
            )
          )
        )
      ),
      removeDevice: rxMethod<number>(
        pipe(
          tap((id) => {
            patchState(store, store.entities().length <= 1 ? withLoading() : withRefreshing(), removeEntity(id));
            router.navigate([RoutePath.DEVICES]);
          }),
          switchMap((id) =>
            store._deleteDevice(id).pipe(
              tapResponse({
                next: () => void 0,
                error: () =>
                  messageService.add({
                    summary: translateService.instant('home.device_delete_error'),
                    severity: 'error',
                  }),
              })
            )
          ),
          finalize(() => patchState(store, withoutRefreshing()))
        )
      ),
    })
  )
);
