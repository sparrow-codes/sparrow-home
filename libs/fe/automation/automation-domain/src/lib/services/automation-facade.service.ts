import { inject, Injectable, Signal } from '@angular/core';
import { SelectOption } from '@sparrow-home/ui';

import { AquaPreferences } from '../model';
import { AutomationStore,automationStore } from '../store/automation-store';

@Injectable({
  providedIn: 'root'
})
export class AutomationFacadeService {
  private readonly _store: AutomationStore = inject(automationStore);

  public get homeDeviceOptions(): Signal<SelectOption<string>[] | null> {
    return this._store.switchDevicesOptions;
  }

  public get aquaPreferences(): Signal<AquaPreferences | null> {
    return this._store.aquaPreferences;
  }

  public setPreferences(preferences: AquaPreferences): void {
    this._store.setPreferences(preferences);
  }

  public setAquaLightScheduler(isActive: boolean): void {
    this._store.setAquaLightScheduler(isActive);
  }

  public fetchInitialData(): void {
    this._store.fetchInitialData();
  }
}
