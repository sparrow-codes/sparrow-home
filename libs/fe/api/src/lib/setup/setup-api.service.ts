import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetCurrentSetupResponse } from './models/get-current-setup.response';
import { SetConfigurationRequest } from './models/set-configuration-request';

export enum SetupUrl {
  READY = 'setup/ready',
  CURRENT = 'setup/current',
  CONFIG_CHANGE = 'setup/config-change',
}

@Injectable({
  providedIn: 'root',
})
export class SetupApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public isConfigurationReady(): Observable<void> {
    return this._http.get<void>(SetupUrl.READY);
  }

  public getCurrentSetup(): Observable<GetCurrentSetupResponse> {
    return this._http.get<GetCurrentSetupResponse>(SetupUrl.CURRENT);
  }

  public changeConfiguration(request: SetConfigurationRequest): Observable<void> {
    return this._http.put<void>(SetupUrl.CONFIG_CHANGE, request);
  }
}
