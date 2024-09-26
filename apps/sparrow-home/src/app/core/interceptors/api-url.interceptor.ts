import { HttpInterceptorFn } from '@angular/common/http';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiPrefix = 'api';
  const backendUrl = 'http://localhost:3000';

  const request = req.clone({url: `${backendUrl}/${apiPrefix}/${req.url}`});

  return next(request);
};
