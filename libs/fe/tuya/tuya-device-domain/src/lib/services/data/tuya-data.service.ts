import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TuyaApiService, TuyaDeviceApiModel } from '@sparrow-home/api';
import { finalize, first, Observable, switchMap, tap } from 'rxjs';

import { LoaderService } from '../../../../../../../../apps/sparrow-home/src/app/ui/services/loader.service';
import { TuyaDevice } from '../../models';
import { TuyaDeviceMapper } from '../mapper/tuya-device-mapper';

@Injectable({
  providedIn: 'root',
})
export class TuyaDataService {
  private readonly _apiService: TuyaApiService = inject(TuyaApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _loadingService: LoaderService = inject(LoaderService);

  private readonly _tuyaDevices: WritableSignal<TuyaDevice[] | null> = signal(null);
  private readonly _searchQuery: WritableSignal<string> = signal('');

  public readonly tuyaDevices: Signal<TuyaDevice[] | null> = computed(() => {
    if (this._searchQuery() === '') {
      return this._tuyaDevices();
    }

    return this._tuyaDevices()?.filter((device) => device.name.includes(this._searchQuery())) ?? null;
  });

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

  public removeDevice(id: number): void {
    this._loadingService.showLoader = true;
    this._apiService
      .deleteDevice(id)
      .pipe(
        first(),
        tap({
          next: () => this._snackBar.open('Usunięto urządzenie!'),
          error: () => this._snackBar.open('Błąd podczas usuwania urządzenia!'),
        }),
        switchMap(() => this._fetchDevices()),
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
