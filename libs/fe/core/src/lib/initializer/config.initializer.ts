import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AppConfig } from '../models';
import { DataFacadeService } from '../services';

export function initializeApp(): Observable<AppConfig> {
  const httpBackend: HttpBackend = inject(HttpBackend);
  const dataService: DataFacadeService = inject(DataFacadeService);
  const http: HttpClient = new HttpClient(httpBackend);
  const configFileName: string = 'config.json';

  return http.get<AppConfig>(`./${configFileName}`).pipe(tap((config: AppConfig) => dataService.saveAppConfig(config)));
}
