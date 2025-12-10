import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';

import { AppConfig } from '../models';
import { DataFacadeService } from '../services';

export function initializeApp(): Observable<AppConfig> {
  const httpBackend: HttpBackend = inject(HttpBackend);
  const dataService: DataFacadeService = inject(DataFacadeService);
  const http: HttpClient = new HttpClient(httpBackend);
  const configFileName: string = 'config.json';
  const translateService: TranslateService = inject(TranslateService);

  return http.get<AppConfig>(`./${configFileName}`).pipe(
    tap((config: AppConfig) => {
      translateService.use(config.lang ?? 'en');
      dataService.saveAppConfig(config);
    })
  );
}
