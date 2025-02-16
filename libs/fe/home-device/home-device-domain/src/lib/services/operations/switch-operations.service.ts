import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeDeviceApiService } from '@sparrow-home/api';
import { first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwitchOperationsService {
  private readonly _apiService: HomeDeviceApiService = inject(HomeDeviceApiService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);

  public setSwitchStatus(id: number, isOn: boolean): void {
    this._apiService
      .setPluginSwitchStatus({ id: id.toString(), body: { isOn } })
      .pipe(
        first(),
        tap({
          error: () => this._snackBar.open('Zmiana statusu urządzenia nie powiodła się!'),
        })
      )
      .subscribe();
  }
}
