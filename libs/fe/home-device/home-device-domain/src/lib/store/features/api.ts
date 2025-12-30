import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, type, withProps } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import {
  GetDeviceDetailsResponseApiModel,
  HomeDeviceApiService,
  HomeDeviceDetailsDtoApiModel,
} from '@sparrow-home/api';
import { RoutePath } from '@sparrow-home/core';
import { toHomeDevice } from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

import { DeviceSettings } from '../../model';
import { HomeDeviceState } from '../model/home-device-state';
import { withDeviceDetails } from '../state-updateters/state-updateters';

export function withApi() {
  return signalStoreFeature(
    { state: type<HomeDeviceState>() },
    withProps(
      (
        store,
        apiService = inject(HomeDeviceApiService),
        router = inject(Router),
        messageService = inject(MessageService),
        translateService = inject(TranslateService)
      ) => ({
        _fetchDevices: (): Observable<HomeDeviceDetailsDtoApiModel[]> =>
          apiService.getAllDevices({
            body: { deviceType: store.deviceTypeFilter(), isOpen: store.deviceTypeFilter() ? true : undefined },
          }),
        _fetchDeviceDetails: (id: number): Observable<GetDeviceDetailsResponseApiModel> =>
          apiService.getDeviceDetails({ id: id.toString() }).pipe(
            tapResponse({
              next: (details) => {
                if (details.deviceDetails) {
                  patchState(store, withDeviceDetails(toHomeDevice(details.deviceDetails)));
                }
              },
              error: (error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.NotFound) {
                  router.navigate([RoutePath.NOT_FOUND]);
                } else {
                  messageService.add({
                    summary: translateService.instant('home.fetch_device_details_error'),
                    severity: 'error',
                  });
                }
              },
            })
          ),
        _updateDeviceMainFields: ({ id, settings }: { id: string; settings: DeviceSettings }): Observable<void> =>
          apiService.setDeviceSettings({
            id: id,
            body: settings,
          }),
        _publishZigbeeEvent: ({
          deviceId,
          payload,
        }: {
          deviceId: string;
          payload: Record<string, unknown>;
        }): Observable<void> => apiService.publishZigbeeEvent({ body: { deviceId, payload } }),
        _changeDeviceName: ({ id, deviceName }: { id: number; deviceName: string }): Observable<void> =>
          apiService.updateDeviceName({ body: { deviceName, id } }),
        _createDevice: ({ deviceType, name }: { deviceType: number; name: string }): Observable<number | null> =>
          apiService.createDevice({ body: { type: deviceType, name } }),
        _deleteDevice: (id: number): Observable<void> => apiService.deleteDevice({ id: id.toString() }),
      })
    )
  );
}
