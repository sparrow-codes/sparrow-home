import { inject, Injectable, Signal } from '@angular/core';

import { TuyaDevice } from '../models';
import { TuyaDataService } from './data/tuya-data.service';
import { LscSwitchOperationsService } from './operations/lsc-switch-operations.service';

@Injectable({
  providedIn: 'root',
})
export class TuyaFacadeService {
  private readonly _dataService: TuyaDataService = inject(TuyaDataService);
  private readonly _lscOperationService: LscSwitchOperationsService = inject(LscSwitchOperationsService);

  public get tuyaDevices(): Signal<TuyaDevice[] | null> {
    return this._dataService.tuyaDevices;
  }

  public get tuyaDeviceDetails(): Signal<TuyaDevice | null> {
    return this._dataService.tuyaDeviceDetails;
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

  public deleteDevice(id: number, deviceName: string): void {
    this._dataService.removeDevice(id, deviceName);
  }

  public fetchDeviceDetailsById(id: number): void {
    this._dataService.fetchDeviceDetailsById(id);
  }

  public setLscSwitchOperationStatus(id: number, isOn: boolean): void {
    this._lscOperationService.setSwitchStatus(id, isOn);
  }
}
