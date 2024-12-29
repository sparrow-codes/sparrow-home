import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetAquaPreferences } from './models/get-aqua-preferences';
import { SetAquaPreferencesRequest } from './models/set-aqua-preferences-request';

enum AquaUrl {
  PREFERENCES = 'aqua/preferences',
  SET_STATUS = 'aqua/status',
}

@Injectable({
  providedIn: 'root',
})
export class AquaApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public getPreferences(): Observable<GetAquaPreferences> {
    return this._http.get<GetAquaPreferences>(AquaUrl.PREFERENCES);
  }

  public setPreferences(request: SetAquaPreferencesRequest): Observable<void> {
    return this._http.put<void>(AquaUrl.PREFERENCES, request);
  }

  public setActiveStatus(isActive: boolean): Observable<void> {
    return this._http.put<void>(AquaUrl.SET_STATUS, { isActive });
  }
}
