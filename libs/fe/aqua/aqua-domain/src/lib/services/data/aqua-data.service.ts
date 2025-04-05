import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AquaPreferencesApiService, GetAquaPreferencesApiModel, HomeDeviceApiService } from '@sparrow-home/api';
import { LoaderService } from '@sparrow-home/core';
import { combineLatest, finalize, first, map, Observable, switchMap, tap } from 'rxjs';

import { AquaPreferences } from '../../models/';

@Injectable({
  providedIn: 'root',
})
export class AquaDataService {
  private readonly _homeDeviceOptions: WritableSignal<{ value: string; label: string }[] | null> = signal(null);
  private readonly _aquaPreferences: WritableSignal<AquaPreferences | null> = signal(null);

  private readonly _homeDeviceApiService: HomeDeviceApiService = inject(HomeDeviceApiService);
  private readonly _aquaApiService: AquaPreferencesApiService = inject(AquaPreferencesApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _loaderService: LoaderService = inject(LoaderService);

  public get homeDeviceOptions(): Signal<{ value: string; label: string }[] | null> {
    return this._homeDeviceOptions.asReadonly();
  }

  public get aquaPreferences(): Signal<AquaPreferences | null> {
    return this._aquaPreferences.asReadonly();
  }

  public setPreferences(preferences: AquaPreferences): void {
    this._aquaApiService
      .setAquaPreference({
        body: {
          from: preferences.lightStartTime?.toISOString(),
          to: preferences.lightEndTime?.toISOString(),
          homeDeviceId: preferences.homeDeviceId,
        },
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
      .setAquaStatus({ body: { isActive } })
      .pipe(
        first(),
        tap({
          next: () => this._snackBar.open(isActive ? 'Harmonogram aktywny' : 'Harmonogram wyłączony'),
          error: () => this._snackBar.open('Błąd aktywowania harmonogramu. Zweryfikuj ustawienia!'),
        })
      )
      .subscribe();
  }

  public fetchInitialData(): void {
    this._loaderService.showLoader = true;
    combineLatest([this._fetchHomeDeviceOptions(), this._fetchPreferences()])
      .pipe(
        first(),
        finalize(() => (this._loaderService.showLoader = false))
      )
      .subscribe();
  }

  private _fetchHomeDeviceOptions(): Observable<{ value: string; label: string }[]> {
    return this._homeDeviceApiService.getAllDevices().pipe(
      first(),
      tap({ error: () => this._snackBar.open('Błąd pobierania listy urządzeń!') }),
      map((response) =>
        response.map((device) => ({
          value: device.homeDeviceId,
          label: device.name,
        }))
      ),
      tap((data) => this._homeDeviceOptions.set(data))
    );
  }

  private _fetchPreferences(): Observable<GetAquaPreferencesApiModel> {
    return this._aquaApiService.getAquaPreference().pipe(
      first(),
      tap({
        next: (response) => {
          const aquaPreferences: AquaPreferences = new AquaPreferences();
          aquaPreferences.lightEndTime = response.lightEndTime ? new Date(response.lightEndTime) : undefined;
          aquaPreferences.lightStartTime = response.lightStartTime ? new Date(response.lightStartTime) : undefined;
          aquaPreferences.homeDeviceId = response.homeDeviceId;
          aquaPreferences.isActive = response.isActive;
          this._aquaPreferences.set(aquaPreferences);
        },
        error: () => this._snackBar.open('Błąd pobierania ustawień akwarium'),
      })
    );
  }
}
