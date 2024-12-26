import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TuyaApiService } from '@sparrow-home/api';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LscSwitchOperationsService {
  private readonly _apiService: TuyaApiService = inject(TuyaApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);

  public setSwitchStatus(id: number, isOn: boolean): void {
    this._apiService
      .setLcsSwitchStatus(id, isOn)
      .pipe(
        first(),
        tap({
          error: () => this._snackBar.open('Zmiana statusu urządzenia nie powiodła się!'),
        })
      )
      .subscribe();
  }
}
