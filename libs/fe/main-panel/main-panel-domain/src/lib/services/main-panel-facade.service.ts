import { inject, Injectable, Signal } from '@angular/core';

import { MainPanelStore } from '../store/main-panel-store';

@Injectable({
  providedIn: 'root',
})
export class MainPanelFacadeService {
  private readonly _store = inject(MainPanelStore);

  public get avgTemperature(): Signal<number | null> {
    return this._store.avgTemperature;
  }

  public get isAlarmOn(): Signal<boolean> {
    return this._store.isAlarmOn;
  }

  public get isHouseClosed(): Signal<boolean | null> {
    return this._store.areAllWindowsAndDoorsClosed;
  }

  public get isAlarmAvailable(): Signal<boolean> {
    return this._store.isAlarmAvailable;
  }

  public fetchInitData(): void {
    this._store.fetchInitData();
  }

  public setAlarm(isAlarmOn: boolean): void {
    this._store.setAlarm(isAlarmOn);
  }
}
