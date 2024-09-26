import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

enum CLOUD_URLS {
  PANASONIC_CLOUD_CONNECT = 'panasonic-cloud/connect',
  PUMP_HEAT_DETAILS =  'panasonic-cloud/pump-heat-details'
}

@Injectable({
  providedIn: 'root'
})
export class CloudConnectionService {

  private readonly http: HttpClient = inject(HttpClient);

  public getPanasonicCloundConnection(): Observable<string> {
    return this.http.get<string>(CLOUD_URLS.PANASONIC_CLOUD_CONNECT)
  }

  public getHeatPumpDetails(): Observable<HeatPump> {
    return this.http.get<HeatPump>(CLOUD_URLS.PUMP_HEAT_DETAILS);
  }
}
