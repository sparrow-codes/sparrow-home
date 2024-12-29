import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetAquaPreferences, TuyaApiService } from '@sparrow-home/api';
import { AquaApiService } from '@sparrow-home/api';
import { LoaderService } from '@sparrow-home/core';
import { combineLatest, finalize, first, map, Observable, switchMap, tap } from 'rxjs';

import { AquaPreferences } from '../../models/';

@Injectable({
  providedIn: 'root',
})
export class AquaDataService {
  private readonly _tuyaDeviceOptions: WritableSignal<{ value: string; label: string }[] | null> = signal(null);
  private readonly _aquaPreferences: WritableSignal<AquaPreferences | null> = signal(null);

  private readonly _tuyaDeviceApiService: TuyaApiService = inject(TuyaApiService);
  private readonly _aquaApiService: AquaApiService = inject(AquaApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _loaderService: LoaderService = inject(LoaderService);

  public get tuyaDeviceOptions(): Signal<{ value: string; label: string }[] | null> {
    return this._tuyaDeviceOptions.asReadonly();
  }

  public get aquaPreferences(): Signal<AquaPreferences | null> {
    return this._aquaPreferences.asReadonly();
  }

  public setPreferences(preferences: AquaPreferences): void {
    this._aquaApiService
      .setPreferences({
        from: preferences.lightStartTime,
        to: preferences.lightEndTime,
        tuyaDeviceId: preferences.tuyaDeviceId,
      })
      .pipe(
        first(),
        tap({
          next: () => this._snackBar.open('Pomyślnie zmieniono ustawienia'),
          error: () => this._snackBar.open('Błąd zmiany ustawień!'),
        }),
        switchMap(() => this._fetchPreferences())
      )
      .subscribe();
  }

  public setAquaLightScheduler(isActive: boolean): void {
    this._aquaApiService
      .setActiveStatus(isActive)
      .pipe(
        first(),
        tap({
          next: () => this._snackBar.open('Harmonogram oświetlenia akwarium jest aktywny!'),
          error: () => this._snackBar.open('Błąd aktywowania harmonogramu. Zweryfikuj ustawienia!'),
        })
      )
      .subscribe();
  }

  public fetchInitialData(): void {
    this._loaderService.showLoader = true;
    combineLatest([this._fetchTuyaDeviceOptions(), this._fetchPreferences()])
      .pipe(
        first(),
        finalize(() => (this._loaderService.showLoader = false))
      )
      .subscribe();
  }

  private _fetchTuyaDeviceOptions(): Observable<{ value: string; label: string }[]> {
    return this._tuyaDeviceApiService.getAll().pipe(
      first(),
      tap({ error: () => this._snackBar.open('Błąd pobierania listy urządzeń!') }),
      map((response) =>
        response.map((device) => ({
          value: device.tuyaDeviceId,
          label: device.name,
        }))
      ),
      tap((data) => this._tuyaDeviceOptions.set(data))
    );
  }

  private _fetchPreferences(): Observable<GetAquaPreferences> {
    return this._aquaApiService.getPreferences().pipe(
      first(),
      tap({
        next: (response) => {
          const aquaPreferences: AquaPreferences = new AquaPreferences();
          aquaPreferences.lightEndTime = response.lightEndTime ? new Date(response.lightEndTime) : undefined;
          aquaPreferences.lightStartTime = response.lightStartTime ? new Date(response.lightStartTime) : undefined;
          aquaPreferences.tuyaDeviceId = response.tuyaDeviceId;
          aquaPreferences.isActive = response.isActive;
          this._aquaPreferences.set(aquaPreferences);
        },
        error: () => this._snackBar.open('Błąd pobierania ustawień akwarium'),
      })
    );
  }
}
