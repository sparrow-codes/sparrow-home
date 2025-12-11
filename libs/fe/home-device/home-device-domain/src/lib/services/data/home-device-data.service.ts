import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  GetDeviceDetailsResponseApiModel,
  HomeDeviceApiService,
  HomeDeviceDetailsDtoApiModel,
} from '@sparrow-home/api';
import { LoaderService, RoutePath } from '@sparrow-home/core';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@sparrow-home/ui';
import { DeviceType, HomeDevice, toHomeDevice } from '@sparrow-home/utils';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, filter, finalize, first, Observable, of, switchMap, take, tap } from 'rxjs';

import { DeviceSettings } from '../../model/device-settings';

@Injectable({
  providedIn: 'root',
})
export class HomeDeviceDataService {
  private readonly _apiService: HomeDeviceApiService = inject(HomeDeviceApiService);
  private readonly _loadingService: LoaderService = inject(LoaderService);
  private readonly _dialogService: DialogService = inject(DialogService);
  private readonly _router: Router = inject(Router);
  private readonly _messageService: MessageService = inject(MessageService);
  private readonly _translateService: TranslateService = inject(TranslateService);

  private readonly _deviceTypeFilter: WritableSignal<DeviceType | null> = signal(null);
  private readonly _homeDevices: WritableSignal<HomeDevice[] | null> = signal(null);
  private readonly _searchQuery: WritableSignal<string> = signal('');
  private readonly _homeDeviceDetails: WritableSignal<HomeDevice | null> = signal(null);

  public readonly homeDevices: Signal<HomeDevice[] | null> = computed(() => {
    if (this._searchQuery() === '') {
      return this._homeDevices();
    }

    return (
      this._homeDevices()?.filter((device) => device.name.toUpperCase().includes(this._searchQuery().toUpperCase())) ??
      null
    );
  });

  public get homeDeviceDetails(): Signal<HomeDevice | null> {
    return this._homeDeviceDetails.asReadonly();
  }

  public get deviceTypeFilter(): Signal<DeviceType | null> {
    return this._deviceTypeFilter.asReadonly();
  }

  public get searchQuery(): Signal<string> {
    return this._searchQuery.asReadonly();
  }

  public setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  public setDeviceTypeFilter(deviceType?: string | number): void {
    if (deviceType !== undefined) {
      this._deviceTypeFilter.set(!isNaN(Number(deviceType)) && deviceType !== '' ? Number(deviceType) : null);
    }
  }

  public fetchAvailableDevices(): void {
    this._loadingService.showLoader = true;
    this._fetchDevices()
      .pipe(finalize(() => (this._loadingService.showLoader = false)))
      .subscribe();
  }

  public createDevices(deviceType: number, name: string): Observable<boolean> {
    return this._apiService
      .createDevice({
        body: {
          type: deviceType,
          name,
        },
      })
      .pipe(
        first(),
        tap({
          next: (isCreated) =>
            this._messageService.add({
              summary: isCreated
                ? this._translateService.instant('home.connection_established')
                : this._translateService.instant('home.connection_not_established'),
              severity: isCreated ? 'success' : 'contrast',
            }),
          error: () =>
            this._messageService.add({
              summary: this._translateService.instant('home.device_pairing_failed'),
              severity: 'error',
            }),
        }),
        catchError(() => of(false))
      );
  }

  public removeDevice(id: number, deviceName: string): void {
    this._dialogService
      .open(ConfirmationDialogComponent, {
        header: this._translateService.instant('home.remove_device'),
        width: '90vw',
        data: {
          content: this._translateService.instant('home.remove_device_confirmation_content', { deviceName }),
        } as ConfirmationDialogData,
      })
      ?.onClose.pipe(
        take(1),
        filter((result) => !!result),
        tap(() => (this._loadingService.showLoader = true)),
        switchMap(() =>
          this._apiService.deleteDevice({ id: id.toString() }).pipe(
            first(),
            tap({
              next: () =>
                this._messageService.add({
                  summary: this._translateService.instant('home.device_deleted'),
                  severity: 'contrast',
                }),
              error: () =>
                this._messageService.add({
                  summary: this._translateService.instant('home.device_delete_error'),
                  severity: 'error',
                }),
            }),
            finalize(() => (this._loadingService.showLoader = false))
          )
        )
      )
      .subscribe(() => this._router.navigate([RoutePath.MAIN]));
  }

  public fetchDeviceDetailsById(id: number): void {
    this._loadingService.showLoader = true;
    this._homeDeviceDetails.set(null);
    this._fetchDeviceDetails(id)
      .pipe(finalize(() => (this._loadingService.showLoader = false)))
      .subscribe();
  }

  public changeDeviceName(id: number, deviceName: string): void {
    this._loadingService.showLoader = true;
    this._apiService
      .updateDeviceName({ body: { deviceName: deviceName, id } })
      .pipe(
        first(),
        switchMap(() => this._fetchDeviceDetails(id))
      )
      .subscribe({
        next: () => {
          this._loadingService.showLoader = false;
          this._messageService.add({
            summary: this._translateService.instant('home.name_change_success'),
            severity: 'success',
          });
        },
        error: () =>
          this._messageService.add({
            summary: this._translateService.instant('home.name_change_error'),
            severity: 'error',
          }),
      });
  }

  public publishZigbeeEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._apiService.publishZigbeeEvent({ body: { deviceId, payload } }).pipe(first()).subscribe();
  }

  public updateDeviceMainFields(id: string, settings: DeviceSettings): void {
    this._apiService
      .setDeviceSettings({
        id,
        body: settings,
      })
      .pipe(
        first(),
        tap({
          error: () =>
            this._messageService.add({
              summary: this._translateService.instant('home.update_fields_error'),
              severity: 'error',
            }),
        }),
        switchMap(() => this._fetchDeviceDetails(Number(id)))
      )
      .subscribe();
  }

  private _fetchDeviceDetails(id: number): Observable<GetDeviceDetailsResponseApiModel> {
    return this._apiService.getDeviceDetails({ id: id.toString() }).pipe(
      first(),
      tap({
        next: (details) => {
          if (details.deviceDetails) {
            this._homeDeviceDetails.set(toHomeDevice(details.deviceDetails));
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this._router.navigate([RoutePath.NOT_FOUND]);
          } else {
            this._messageService.add({
              summary: this._translateService.instant('home.fetch_device_details_error'),
              severity: 'error',
            });
          }
        },
      })
    );
  }

  private _fetchDevices(): Observable<HomeDeviceDetailsDtoApiModel[]> {
    return this._apiService
      .getAllDevices({
        body: { deviceType: this.deviceTypeFilter(), isOpen: this.deviceTypeFilter() ? true : undefined },
      })
      .pipe(
        first(),
        tap({
          next: (devices) => this._homeDevices.set(devices.sort(this._homeDeviceSort).map(toHomeDevice)),
          error: () =>
            this._messageService.add({
              summary: this._translateService.instant('home.fetch_devices_error'),
              severity: 'error',
            }),
        })
      );
  }

  private _homeDeviceSort(device1: HomeDeviceDetailsDtoApiModel, device2: HomeDeviceDetailsDtoApiModel): number {
    if (device1.name > device2.name) {
      return 1;
    }

    if (device1.name < device2.name) {
      return -1;
    }

    return 0;
  }
}
