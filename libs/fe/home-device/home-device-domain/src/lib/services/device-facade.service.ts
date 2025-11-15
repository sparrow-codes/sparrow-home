import { inject, Injectable, Signal } from '@angular/core';
import { DeviceType } from '@sparrow-home/utils';
import { Observable } from 'rxjs';

import { HomeDevice } from '../models';
import { HomeDeviceDataService } from './data/home-device-data.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceFacadeService {
  private readonly _dataService: HomeDeviceDataService = inject(HomeDeviceDataService);

  public get homeDevices(): Signal<HomeDevice[] | null> {
    return this._dataService.homeDevices;
  }

  public get homeDeviceDetails(): Signal<HomeDevice | null> {
    return this._dataService.homeDeviceDetails;
  }

  public get deviceFilter(): Signal<DeviceType | null> {
    return this._dataService.deviceTypeFilter;
  }

  public get searchQuery(): Signal<string> {
    return this._dataService.searchQuery;
  }

  public fetchDevices(): void {
    this._dataService.fetchAvailableDevices();
  }

  public setSearchQuery(query: string): void {
    this._dataService.setSearchQuery(query);
  }

  public createDevice(deviceType: number, name: string): Observable<boolean> {
    return this._dataService.createDevices(deviceType, name);
  }

  public deleteDevice(id: number, deviceName: string): void {
    this._dataService.removeDevice(id, deviceName);
  }

  public fetchDeviceDetailsById(id: number): void {
    this._dataService.fetchDeviceDetailsById(id);
  }

  public setDeviceTypeFilter(deviceType?: string | number): void {
    this._dataService.setDeviceTypeFilter(deviceType);
  }

  public changeDeviceName(id: number, deviceName: string): void {
    this._dataService.changeDeviceName(id, deviceName);
  }

  public publishZigbeeEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._dataService.publishZigbeeEvent(deviceId, payload);
  }
}
