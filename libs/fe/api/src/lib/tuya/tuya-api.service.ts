import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateDeviceRequest } from './models/create-device-request';
import { TuyaDeviceApiModel } from './models/tuya-device-api-model';

enum TuyaDeviceUrl {
  ALL = 'tuya-device/all',
  CREATE = 'tuya-device/create',
  DELETE = 'tuya-device/delete',
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
}
