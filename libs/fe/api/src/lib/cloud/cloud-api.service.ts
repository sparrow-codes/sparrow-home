import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetCircularPumpPreferencesResponse } from './models/circular-pump/get-circular-pump-preferences-response';
import { SetCircularPumpPreferencesRequest } from './models/circular-pump/set-circular-pump-preferences-request';
import { ChangeHeatPumpOperationRequest } from './models/panasonic/change-heat-pump-operation.request';
import { GetHeatPumpDetailsResponse } from './models/panasonic/get-heat-pump-details-response';
import { GetScheduleWaterHeatingResponse } from './models/panasonic/get-schedule-water-heating.response';
import { ScheduleWaterHeatingRequest } from './models/panasonic/schedule-water-heating.request';

enum CLOUD_URLS {
  PUMP_HEAT_DETAILS = 'panasonic-cloud/pump-heat-details',
  CHANGE_OPERATION_STATUS = 'panasonic-cloud/change-operation-status',
  SCHEDULE_WATER_HEATING = 'panasonic-cloud/scheduled-water-heating',
  SCHEDULE_WATER_HEATING_STATUS = 'panasonic-cloud/scheduled-water-heating-status',
  CIRCULAR_PUMP_PREFERENCES = 'panasonic-cloud/circular-pump/preferences',
  CIRCULAR_PUMP_STATUS = 'panasonic-cloud/circular-pump/status',
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

  public getCircularPumpPreferences(): Observable<GetCircularPumpPreferencesResponse> {
    return this._http.get<GetCircularPumpPreferencesResponse>(CLOUD_URLS.CIRCULAR_PUMP_PREFERENCES);
  }

  public setCircularPumpPreferences(request: SetCircularPumpPreferencesRequest): Observable<void> {
    return this._http.put<void>(CLOUD_URLS.CIRCULAR_PUMP_PREFERENCES, request);
  }

  public setCircularPumpScheduleStatus(isActive: boolean): Observable<void> {
    return this._http.put<void>(CLOUD_URLS.CIRCULAR_PUMP_STATUS, { isActive });
  }
}
