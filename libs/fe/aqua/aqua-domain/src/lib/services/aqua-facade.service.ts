import { inject, Injectable, Signal } from '@angular/core';

import { AquaPreferences } from '../models';
import { AquaDataService } from './data/aqua-data.service';

@Injectable({
  providedIn: 'root',
})
export class AquaFacadeService {
  private readonly _dataService: AquaDataService = inject(AquaDataService);

  public get tuyaDeviceOptions(): Signal<{ value: string; label: string }[] | null> {
    return this._dataService.tuyaDeviceOptions;
  }

  public get aquaPreferences(): Signal<AquaPreferences | null> {
    return this._dataService.aquaPreferences;
  }

  public setPreferences(preferences: AquaPreferences): void {
    this._dataService.setPreferences(preferences);
  }

  public setAquaLightScheduler(isActive: boolean): void {
    this._dataService.setAquaLightScheduler(isActive);
  }

  public fetchInitialData(): void {
    this._dataService.fetchInitialData();
  }
}
