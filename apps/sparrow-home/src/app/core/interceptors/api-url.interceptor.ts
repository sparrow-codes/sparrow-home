import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiPrefix: string = 'api';
  const backendUrl: string = 'http://localhost:3000';
  const request: HttpRequest<unknown> = req.clone({url: `${backendUrl}/${apiPrefix}/${req.url}`});
  return next(request);
};
