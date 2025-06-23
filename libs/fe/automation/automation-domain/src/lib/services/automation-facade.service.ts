import { inject, Injectable, Signal } from '@angular/core';
import { SelectOption } from '@sparrow-home/ui';

import { AquaPreferences } from '../model';
import { CircularPumpPreferences } from '../model/circular-pump-preferences';
import { AutomationStore, automationStore } from '../store/automation-store';

@Injectable({
  providedIn: 'root',
})
export class AutomationFacadeService {
  private readonly _store: AutomationStore = inject(automationStore);

  public get homeDeviceOptions(): Signal<SelectOption<string>[] | null> {
    return this._store.switchDevicesOptions;
  }

  public get aquaPreferences(): Signal<AquaPreferences | null> {
    return this._store.aquaPreferences;
  }

  public get circularPumpPreferences(): Signal<CircularPumpPreferences | null> {
    return this._store.circularPumpPreferences;
  }

  public setAquaPreferences(preferences: AquaPreferences): void {
    this._store.setAquaPreferences(preferences);
  }

  public setCircularPumpPreferences(preferences: CircularPumpPreferences): void {
    this._store.setCircularPumpPreferences(preferences);
  }

  public setAquaLightScheduler(isActive: boolean): void {
    this._store.setAquaLightScheduler(isActive);
  }

  public setCircularPumpScheduler(isActive: boolean): void {
    this._store.setCircularPumpScheduler(isActive);
  }

  public fetchInitialData(): void {
    this._store.fetchInitialData();
  }
}
