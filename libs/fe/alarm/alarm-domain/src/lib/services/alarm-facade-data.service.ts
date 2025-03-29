import { inject, Injectable, Signal } from '@angular/core';

import { AlarmStore } from '../store/alarm-store';

@Injectable({
  providedIn: 'root',
})
export class AlarmFacadeDataService {
  private readonly _alarmStore = inject(AlarmStore);

  public get alarmMode(): Signal<boolean> {
    return this._alarmStore.isActive;
  }

  public setAlarm(isOn: boolean): void {
    this._alarmStore.setAlarm(isOn);
  }

  public fetchAlarmMode(): void {
    this._alarmStore.getAlarmMode();
  }

  public setAlarmMode(isActive: boolean): void {
    this._alarmStore.setAlarmMode(isActive);
  }
}
