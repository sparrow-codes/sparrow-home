import { inject, Injectable, Signal } from '@angular/core';
import { DeviceType, HomeDevice } from '@sparrow-home/utils';
import { Observable } from 'rxjs';

import { DeviceSettings } from '../model';
import { HomeDeviceStore } from '../store/home-device.store';

@Injectable({
  providedIn: 'root',
})
export class DeviceFacadeService {
  private readonly _store: HomeDeviceStore = inject(HomeDeviceStore);

  public get homeDevices(): Signal<HomeDevice[]> {
    return this._store.homeDevices;
  }

  public get homeDeviceDetails(): Signal<HomeDevice | null> {
    return this._store.deviceDetails;
  }

  public get deviceFilter(): Signal<DeviceType | null> {
    return this._store.deviceTypeFilter;
  }

  public get searchQuery(): Signal<string> {
    return this._store.searchQuery;
  }

  public get noDevices(): Signal<boolean | null> {
    return this._store.noDevices;
  }

  public get devicePaired(): Signal<boolean | null> {
    return this._store.devicePaired;
  }

  public get isLoading$(): Observable<boolean> {
    return this._store.isLoading$;
  }

  public get isRefreshing$(): Observable<boolean> {
    return this._store.isRefreshing$;
  }

  public get refreshingObjects(): Signal<Set<string>> {
    return this._store.refreshingObjects;
  }

  public fetchDevices(): void {
    this._store.fetchDevices();
  }

  public setSearchQuery(query: string): void {
    this._store.setSearchQuery(query);
  }
  public createDevice(deviceType: number, name: string): void {
    this._store.createDevice({ deviceType, name });
  }

  public deleteDevice(id: number): void {
    this._store.removeDevice(id);
  }

  public fetchDeviceDetailsById(id: number): void {
    this._store.fetchDeviceDetails(id);
  }

  public setDeviceTypeFilter(deviceType?: number): void {
    this._store.setDeviceType(deviceType);
  }

  public changeDeviceName(id: number, deviceName: string): void {
    this._store.changeDeviceName({ id, deviceName });
  }

  public publishZigbeeEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._store.publishZigbeeEvent({ deviceId, payload });
  }

  public updateDeviceSettings(id: string, settings: DeviceSettings): void {
    this._store.updateDeviceMainFields({ id, settings });
  }
}
