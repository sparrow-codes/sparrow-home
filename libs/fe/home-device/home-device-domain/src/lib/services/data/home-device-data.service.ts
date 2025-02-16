import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HomeDeviceApiService, HomeDeviceDtoApiModel } from '@sparrow-home/api';
import { LoaderService, RoutePath } from '@sparrow-home/core';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@sparrow-home/ui';
import { catchError, filter, finalize, first, map, Observable, of, switchMap, take, tap } from 'rxjs';

import { HomeDevice } from '../../models';
import { HomeDeviceMapper } from '../mapper/home-device-mapper';

@Injectable({
  providedIn: 'root',
})
export class HomeDeviceDataService {
  private readonly _apiService: HomeDeviceApiService = inject(HomeDeviceApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _loadingService: LoaderService = inject(LoaderService);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _router: Router = inject(Router);

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

  public setSearchQuery(query: string): void {
    this._searchQuery.set(query);
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
        map(() => true),
        tap({
          next: (isCreated) =>
            this._snackBar.open(isCreated ? 'Połączono urządzenie!' : 'Nie udało się nawiązać połączenia'),
          error: () => this._snackBar.open('Błąd podczas towrzenia urządzenia'),
        }),
        catchError(() => of(false))
      );
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
          this._apiService.deleteDevice({ id: id.toString() }).pipe(
            first(),
            tap({
              next: () => this._snackBar.open('Usunięto urządzenie!'),
              error: () => this._snackBar.open('Błąd podczas usuwania urządzenia!'),
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
    this._apiService
      .getDeviceDetails({ id: id.toString() })
      .pipe(
        first(),
        tap({
          next: (details) => {
            if (details.deviceDetails) {
              this._homeDeviceDetails.set(HomeDeviceMapper.mapDetails(details.deviceDetails));
            }
          },
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

  private _fetchDevices(): Observable<HomeDeviceDtoApiModel[]> {
    return this._apiService.getAllDevices().pipe(
      first(),
      tap({
        next: (devices) => this._homeDevices.set(devices.map(HomeDeviceMapper.map)),
        error: () => this._snackBar.open('Błąd pobierania listy urządzeń'),
      })
    );
  }
}
