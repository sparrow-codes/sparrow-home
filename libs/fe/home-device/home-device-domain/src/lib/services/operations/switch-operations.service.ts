import { inject, Injectable } from '@angular/core';
import { HomeDeviceApiService } from '@sparrow-home/api';
import { first, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SwitchOperationsService {
  private readonly _apiService: HomeDeviceApiService = inject(HomeDeviceApiService);
  private readonly _messageService: MessageService = inject(MessageService);

  public setSwitchStatus(id: number, isOn: boolean): void {
    this._apiService
      .setPluginSwitchStatus({ id: id.toString(), body: { isOn } })
      .pipe(
        first(),
        tap({
          error: () =>
            this._messageService.add({ summary: 'Zmiana statusu urządzenia nie powiodła się!', severity: 'error' }),
        })
      )
      .subscribe();
  }
}
