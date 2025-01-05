import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TuyaApiService, TuyaDeviceApiModel } from '@sparrow-home/api';
import { LoaderService, RoutePath } from '@sparrow-home/core';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@sparrow-home/ui';
import { filter, finalize, first, Observable, switchMap, take, tap } from 'rxjs';

import { TuyaDevice } from '../../models';
import { TuyaDeviceMapper } from '../mapper/tuya-device-mapper';

@Injectable({
  providedIn: 'root',
})
export class TuyaDataService {
  private readonly _apiService: TuyaApiService = inject(TuyaApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _loadingService: LoaderService = inject(LoaderService);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _router: Router = inject(Router);

  private readonly _tuyaDevices: WritableSignal<TuyaDevice[] | null> = signal(null);
  private readonly _searchQuery: WritableSignal<string> = signal('');
  private readonly _tuyaDeviceDetails: WritableSignal<TuyaDevice | null> = signal(null);

  public readonly tuyaDevices: Signal<TuyaDevice[] | null> = computed(() => {
    if (this._searchQuery() === '') {
      return this._tuyaDevices();
    }

    return (
      this._tuyaDevices()?.filter((device) => device.name.toUpperCase().includes(this._searchQuery().toUpperCase())) ??
      null
    );
  });

  public get tuyaDeviceDetails(): Signal<TuyaDevice | null> {
    return this._tuyaDeviceDetails;
  }

  public setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  public fetchAvailableTuyaDevices(): void {
    this._loadingService.showLoader = true;
    this._fetchDevices()
      .pipe(finalize(() => (this._loadingService.showLoader = false)))
      .subscribe();
  }

  public createDevices(deviceType: number, tuyaId: string, name: string): void {
    this._loadingService.showLoader = true;
    this._apiService
      .createDevice({
        type: deviceType,
        tuyaDeviceId: tuyaId,
        name,
      })
      .pipe(
        first(),
        tap({
          next: () => this._snackBar.open('Utworzono urządzenie!'),
          error: () => this._snackBar.open('Błąd podczas towrzenia urządzenia'),
        }),
        switchMap(() => this._fetchDevices()),
        finalize(() => (this._loadingService.showLoader = false))
      )
      .subscribe();
  }

  public removeDevice(id: number, deviceName: string): void {
    this._matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Usuń urządzenie',
          content: `Czy na pewno chcesz usunąć urządzenie o nazwie: ${deviceName}?`,
        } as ConfirmationDialogData,
      })
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result),
        tap(() => (this._loadingService.showLoader = true)),
        switchMap(() =>
          this._apiService.deleteDevice(id).pipe(
            first(),
            tap({
              next: () => this._snackBar.open('Usunięto urządzenie!'),
              error: () => this._snackBar.open('Błąd podczas usuwania urządzenia!'),
            }),
            switchMap(() => this._fetchDevices()),
            finalize(() => (this._loadingService.showLoader = false))
          )
        )
      )
      .subscribe();
  }

  public fetchDeviceDetailsById(id: number): void {
    this._loadingService.showLoader = true;
    this._tuyaDeviceDetails.set(null);
    this._apiService
      .getDeviceDetails(id)
      .pipe(
        first(),
        tap({
          next: (details) => this._tuyaDeviceDetails.set(TuyaDeviceMapper.mapDetails(details)),
          error: (error: HttpErrorResponse) => {
            if (error.status === HttpStatusCode.NotFound) {
              this._router.navigate([RoutePath.NOT_FOUND]);
            } else {
              this._snackBar.open('Błąd podczas pobierania szczegółów urządzenia!');
            }
          },
        }),
        finalize(() => (this._loadingService.showLoader = false))
      )
      .subscribe();
  }

  private _fetchDevices(): Observable<TuyaDeviceApiModel[]> {
    return this._apiService.getAll().pipe(
      first(),
      tap({
        next: (devices) => this._tuyaDevices.set(devices.map(TuyaDeviceMapper.map)),
        error: () => this._snackBar.open('Błąd pobierania listy urządzeń'),
      })
    );
  }
}
