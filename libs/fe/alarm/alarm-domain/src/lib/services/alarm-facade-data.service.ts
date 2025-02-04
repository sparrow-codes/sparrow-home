import { inject, Injectable } from '@angular/core';

import { AlarmStore } from '../store/alarm-store';

@Injectable({
  providedIn: 'root',
})
export class AlarmFacadeDataService {
  private readonly _alarmStore = inject(AlarmStore);

  public setAlarm(isOn: boolean): void {
    this._alarmStore.setAlarm(isOn);
  }
}
