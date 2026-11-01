import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';

import { RoutePath } from '../enum';
import { AppStore, appStore } from '../stores/app-store';

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const store: AppStore = inject(appStore);
  const authToken: string | null = store.token();
  const router: Router = inject(Router);

  if (!authToken) {
    return handleRequest(req);
  }

  const request: HttpRequest<unknown> = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + authToken,
    },
  });
  return handleRequest(request);

  function handleRequest(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (request.url.endsWith('setup/ready')) {
      return next(request);
    }

    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          router.navigate([RoutePath.LOGIN]);
        }
        throw error;
      })
    ) as Observable<HttpEvent<unknown>>;
  }
};
