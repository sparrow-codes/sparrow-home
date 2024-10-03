import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

enum SETUP_URL {
  READY = 'setup/ready',
}

@Injectable({
  providedIn: 'root',
})
export class SetupApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public isConfigurationReady(): Observable<void> {
    return this._http.get<void>(SETUP_URL.READY);
  }
}
