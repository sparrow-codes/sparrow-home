import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChangeHeatPumpOperationRequest } from '~api/cloud/models/change-heat-pump-operation.request';
import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';

enum CLOUD_URLS {
  PUMP_HEAT_DETAILS = 'panasonic-cloud/pump-heat-details',
  CHANGE_OPERATION_STATUS = 'panasonic-cloud/change-operation-status',
}

@Injectable({
  providedIn: 'root',
})
export class CloudApiService {
  private readonly http: HttpClient = inject(HttpClient);

  public getHeatPumpDetails(): Observable<GetHeatPumpDetailsResponse> {
    return this.http.get<GetHeatPumpDetailsResponse>(CLOUD_URLS.PUMP_HEAT_DETAILS);
  }

  public changeOperationsStatus(request: ChangeHeatPumpOperationRequest): Observable<void> {
    return this.http.put<void>(CLOUD_URLS.CHANGE_OPERATION_STATUS, request);
  }
}
