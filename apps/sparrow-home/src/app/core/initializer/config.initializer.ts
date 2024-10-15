import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AppConfig } from '~core/models/app-config';
import { DataFacadeService } from '~core/services/data-facade.service';

export function initializeApp(httpBackend: HttpBackend, dataService: DataFacadeService) {
  const http: HttpClient = new HttpClient(httpBackend);
  const configFileName: string = 'config.json';

  return (): Observable<unknown> =>
    http.get<AppConfig>(`./${configFileName}`).pipe(tap((config) => dataService.saveAppConfig(config)));
}
