import { inject, Injectable, Signal } from '@angular/core';
import { RootStore } from '../store/root-store';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

@Injectable({
  providedIn: 'root'
})
export class RootDataFacadeService {
  private readonly store = inject(RootStore);

  public get heatPump(): Signal<HeatPump | null> {
    return this.store.heatPump;
  }

  public get isLoading(): Signal<boolean> {
    return this.store.loading;
  }

  public connectToCloudServices(): void {
    this.store.connectToCloud();
  }

  public fetchWifiDeviceList(): void {
    this.store.fetchDeviceList();
  }
}
