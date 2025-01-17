import { inject, Injectable, Signal } from '@angular/core';

import { HomeDevice } from '../models';
import { HomeDeviceDataService } from './data/home-device-data.service';
import { SwitchOperationsService } from './operations/switch-operations.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceFacadeService {
  private readonly _dataService: HomeDeviceDataService = inject(HomeDeviceDataService);
  private readonly _switchOperationService: SwitchOperationsService = inject(SwitchOperationsService);

  public get homeDevices(): Signal<HomeDevice[] | null> {
    return this._dataService.homeDevices;
  }

  public get homeDeviceDetails(): Signal<HomeDevice | null> {
    return this._dataService.homeDeviceDetails;
  }

  public fetchDevices(): void {
    this._dataService.fetchAvailableDevices();
  }

  public setSearchQuery(query: string): void {
    this._dataService.setSearchQuery(query);
  }

  public createDevice(deviceType: number, homeDeviceId: string, name: string): void {
    this._dataService.createDevices(deviceType, homeDeviceId, name);
  }

  public deleteDevice(id: number, deviceName: string): void {
    this._dataService.removeDevice(id, deviceName);
  }

  public fetchDeviceDetailsById(id: number): void {
    this._dataService.fetchDeviceDetailsById(id);
  }

  public setLscSwitchOperationStatus(id: number, isOn: boolean): void {
    this._switchOperationService.setSwitchStatus(id, isOn);
  }
}
