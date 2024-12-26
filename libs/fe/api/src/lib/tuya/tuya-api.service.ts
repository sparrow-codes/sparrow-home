import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TuyaDeviceDetailsApiModel } from './models';
import { CreateDeviceRequest } from './models';
import { TuyaDeviceApiModel } from './models';

enum TuyaDeviceUrl {
  ALL = 'tuya-device/all',
  CREATE = 'tuya-device/create',
  DELETE = 'tuya-device/delete',
  DETAILS = 'tuya-device/details',
  LCS_SWITCH_STATUS = 'tuya-device/lcs-switch/status',
}

@Injectable({
  providedIn: 'root',
})
export class TuyaApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public getAll(): Observable<TuyaDeviceApiModel[]> {
    return this._http.get<TuyaDeviceApiModel[]>(TuyaDeviceUrl.ALL);
  }

  public createDevice(request: CreateDeviceRequest): Observable<void> {
    return this._http.post<void>(TuyaDeviceUrl.CREATE, request);
  }

  public deleteDevice(id: number): Observable<void> {
    return this._http.delete<void>(`${TuyaDeviceUrl.DELETE}/${id}`);
  }

  public getDeviceDetails(id: number): Observable<TuyaDeviceDetailsApiModel> {
    return this._http
      .get<{ deviceDetails: TuyaDeviceDetailsApiModel }>(`${TuyaDeviceUrl.DETAILS}/${id}`)
      .pipe(map((response) => response.deviceDetails));
  }

  public setLcsSwitchStatus(id: number, isOn: boolean): Observable<void> {
    return this._http.post<void>(`${TuyaDeviceUrl.LCS_SWITCH_STATUS}/${id}`, { isOn });
  }
}
