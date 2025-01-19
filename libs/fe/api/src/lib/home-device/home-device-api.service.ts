import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CreateDeviceRequest, HomeDeviceApiModel, HomeDeviceDetailsApiModel } from './models';

enum HomeDeviceUrl {
  ALL = 'home-device/all',
  CREATE = 'home-device/create',
  DELETE = 'home-device/delete',
  DETAILS = 'home-device/details',
  SWITCH_STATUS = 'home-device/switch/status',
}

@Injectable({
  providedIn: 'root',
})
export class HomeDeviceApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public getAll(): Observable<HomeDeviceApiModel[]> {
    return this._http.get<HomeDeviceApiModel[]>(HomeDeviceUrl.ALL);
  }

  public createDevice(request: CreateDeviceRequest): Observable<boolean> {
    return this._http.post<boolean>(HomeDeviceUrl.CREATE, request);
  }

  public deleteDevice(id: number): Observable<void> {
    return this._http.delete<void>(`${HomeDeviceUrl.DELETE}/${id}`);
  }

  public getDeviceDetails(id: number): Observable<HomeDeviceDetailsApiModel> {
    return this._http
      .get<{ deviceDetails: HomeDeviceDetailsApiModel }>(`${HomeDeviceUrl.DETAILS}/${id}`)
      .pipe(map((response) => response.deviceDetails));
  }

  public setSwitchStatus(id: number, isOn: boolean): Observable<void> {
    return this._http.post<void>(`${HomeDeviceUrl.SWITCH_STATUS}/${id}`, { isOn });
  }
}
