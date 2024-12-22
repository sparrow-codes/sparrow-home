import { inject, Injectable, Signal } from '@angular/core';

import { TuyaDevice } from '../models';
import { TuyaDataService } from './data/tuya-data.service';

@Injectable({
  providedIn: 'root',
})
export class TuyaFacadeService {
  private readonly _dataService: TuyaDataService = inject(TuyaDataService);

  public get tuyaDevices(): Signal<TuyaDevice[] | null> {
    return this._dataService.tuyaDevices;
  }

  public fetchDevices(): void {
    this._dataService.fetchAvailableTuyaDevices();
  }

  public setSearchQuery(query: string): void {
    this._dataService.setSearchQuery(query);
  }

  public createDevice(deviceType: number, tuyaId: string, name: string): void {
    this._dataService.createDevices(deviceType, tuyaId, name);
  }

  public deleteDevice(id: number): void {
    this._dataService.removeDevice(id);
  }
}
