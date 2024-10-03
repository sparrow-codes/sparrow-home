import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { DataFacadeService } from '~core/services/data-facade.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const dataService: DataFacadeService = inject(DataFacadeService);
  const authToken: string | null = dataService.authToken;

  if (!authToken) {
    return next(req);
  }

  const request: HttpRequest<unknown> = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + (dataService.authToken ?? ''),
    },
  });
  return next(request);
};
