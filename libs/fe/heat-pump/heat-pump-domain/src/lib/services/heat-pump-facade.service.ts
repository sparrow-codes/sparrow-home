import { inject, Injectable, Signal } from '@angular/core';
import { GetHeatPumpDetailsResponse } from '@sparrow-home/api';

import { WaterTankOptions } from '../models';
import { CloudStore } from '../store/cloud-store';

@Injectable({
  providedIn: 'root',
})
export class HeatPumpFacadeService {
  private readonly _cloudStore = inject(CloudStore);

  public get waterTankOptions(): Signal<WaterTankOptions | null> {
    return this._cloudStore.waterTankOptions;
  }

  public get heatPump(): Signal<GetHeatPumpDetailsResponse | null> {
    return this._cloudStore.heatPump;
  }

  public getHeatPumpDetails(): void {
    this._cloudStore.getHeatPumpDetails();
  }

  public setHeatPumpOperationStatus(isWaterOn: boolean, isHeatOn: boolean): void {
    this._cloudStore.changeOperationsStatus({ isWaterOn, isHeatOn });
  }

  public changeScheduledWaterHeatingStatus(status: boolean): void {
    this._cloudStore.setWaterHeatingStatus(status);
  }
}
