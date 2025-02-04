import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum AlarmUrl {
  SET_ALARM = 'alarm/set',
}

@Injectable({
  providedIn: 'root',
})
export class AlarmApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public setAlarm(isOn: boolean): Observable<void> {
    return this._http.put<void>(AlarmUrl.SET_ALARM, { isOn });
  }
}
