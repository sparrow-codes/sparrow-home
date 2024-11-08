import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChangeHeatPumpOperationRequest } from '~api/cloud/models/change-heat-pump-operation.request';
import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';
import { GetScheduleWaterHeatingResponse } from '~api/cloud/models/get-schedule-water-heating.response';
import { ScheduleWaterHeatingRequest } from '~api/cloud/models/schedule-water-heating.request';

enum CLOUD_URLS {
  PUMP_HEAT_DETAILS = 'panasonic-cloud/pump-heat-details',
  CHANGE_OPERATION_STATUS = 'panasonic-cloud/change-operation-status',
  SCHEDULE_WATER_HEATING = 'panasonic-cloud/scheduled-water-heating',
  SCHEDULE_WATER_HEATING_STATUS = 'panasonic-cloud/scheduled-water-heating-status',
  LONG_BATH = 'panasonic-cloud/long-bath'
}

@Injectable({
  providedIn: 'root',
})
export class CloudApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public getHeatPumpDetails(): Observable<GetHeatPumpDetailsResponse> {
    return this._http.get<GetHeatPumpDetailsResponse>(CLOUD_URLS.PUMP_HEAT_DETAILS);
  }

  public changeOperationsStatus(request: ChangeHeatPumpOperationRequest): Observable<void> {
    return this._http.put<void>(CLOUD_URLS.CHANGE_OPERATION_STATUS, request);
  }

  public scheduleWaterHeating(request: ScheduleWaterHeatingRequest): Observable<void> {
    return this._http.put<void>(CLOUD_URLS.SCHEDULE_WATER_HEATING, request);
  }

  public getScheduledWaterHeatingStatus(): Observable<GetScheduleWaterHeatingResponse> {
    return this._http.get<GetScheduleWaterHeatingResponse>(CLOUD_URLS.SCHEDULE_WATER_HEATING_STATUS);
  }

  public setLongBath(isOn: boolean): Observable<void> {
    return this._http.put<void>(CLOUD_URLS.LONG_BATH, { isOn });
  }
}
