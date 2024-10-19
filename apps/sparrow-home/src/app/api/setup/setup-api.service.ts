import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetCurrentSetupResponse } from '~api/setup/models/get-current-setup.response';
import { SetConfigurationRequest } from '~api/setup/models/set-configuration-request';
import { SetModeRequest } from '~api/setup/models/set-mode-request';

export enum SetupUrl {
  READY = 'setup/ready',
  CURRENT = 'setup/current',
  SET_MODE = 'setup/set-mode',
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

  public setMode(mode: number): Observable<void> {
    return this._http.post<void>(SetupUrl.SET_MODE, { mode } as SetModeRequest);
  }

  public changeConfiguration(request: SetConfigurationRequest): Observable<void> {
    return this._http.put<void>(SetupUrl.CONFIG_CHANGE, request);
  }
}
