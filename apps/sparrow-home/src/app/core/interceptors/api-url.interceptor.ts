import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { DataFacadeService } from '../services/data-facade.service';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const dataService: DataFacadeService = inject(DataFacadeService);
  const backendUrl: string = dataService.applicationConfig()?.backendUrl ?? '';
  const apiPrefix: string = dataService.applicationConfig()?.apiPrefix ?? '';
  const request: HttpRequest<unknown> = req.clone({ url: `${backendUrl}/${apiPrefix}/${req.url}` });
  return next(request);
};
