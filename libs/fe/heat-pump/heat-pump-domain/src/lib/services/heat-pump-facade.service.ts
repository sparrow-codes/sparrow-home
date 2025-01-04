import { inject, Injectable, Signal } from '@angular/core';

import { CircularPumpPreferences, HeatPump, WaterTankOptions } from '../models';
import { CloudStore } from '../store/cloud-store';

@Injectable({
  providedIn: 'root',
})
export class HeatPumpFacadeService {
  private readonly _cloudStore = inject(CloudStore);

  public get waterTankOptions(): Signal<WaterTankOptions | null> {
    return this._cloudStore.waterTankOptions;
  }

  public get heatPump(): Signal<HeatPump | null> {
    return this._cloudStore.heatPump;
  }

  public get circularPumpPreferences(): Signal<CircularPumpPreferences | null> {
    return this._cloudStore.circularPumpPreferences;
  }

  public get tuyaDeviceOptions(): Signal<{ value: string; label: string }[] | null> {
    return this._cloudStore.tuyaDeviceOptions;
  }

  public fetchInitData(): void {
    this._cloudStore.fetchInitData();
  }

  public setHeatPumpOperationStatus(isWaterOn: boolean, isHeatOn: boolean): void {
    this._cloudStore.changeOperationsStatus({ isWaterOn, isHeatOn });
  }

  public changeScheduledWaterHeatingStatus(status: boolean): void {
    this._cloudStore.setWaterHeatingStatus(status);
  }

  public setCircularPumpPreferences(preferences: CircularPumpPreferences): void {
    this._cloudStore.setCircularPumpPreferences(preferences);
  }

  public setCircularPumpScheduleStatus(isActive: boolean): void {
    this._cloudStore.setCircularPumpScheduleStatus(isActive);
  }
}
