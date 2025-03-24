import { inject, Injectable, Signal } from '@angular/core';
import { SelectOption } from '@sparrow-home/ui';

import { CircularPumpPreferences, HeatingPreferences, HeatPump, WaterTankOptions } from '../models';
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

  public get homeDeviceOptions(): Signal<{ value: string; label: string }[] | null> {
    return this._cloudStore.homeDeviceOptions;
  }

  public get temperatureSensorsOptions(): Signal<SelectOption<number>[] | null> {
    return this._cloudStore.temperatureSensorsOptions;
  }

  public get heatingPreferences(): Signal<HeatingPreferences | null> {
    return this._cloudStore.heatingPreferences;
  }

  public get initialDataLoaded(): Signal<boolean> {
    return this._cloudStore.initialDataLoaded;
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

  public setHeatingPreferences(preferences: HeatingPreferences): void {
    this._cloudStore.setHeatPreferences(preferences);
  }

  public activateAutomaticHeating(isActive: boolean): void {
    this._cloudStore.activateAutomaticHeating(isActive);
  }
}
