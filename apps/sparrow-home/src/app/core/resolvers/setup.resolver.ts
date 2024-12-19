import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';

import { DataFacadeService } from '../services/data-facade.service';

export const setupResolver: ResolveFn<void> = (): Observable<void> => {
  const dataService: DataFacadeService = inject(DataFacadeService);
  return dataService.fetchCurrentConfiguration();
};
