import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { RoutePath } from '../enum';
import { AuthService, DataFacadeService } from '../services';

export const configurationReadyGuard: CanActivateFn = (): Observable<boolean | UrlTree> | boolean => {
  const dataFacadeService: DataFacadeService = inject(DataFacadeService);
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (dataFacadeService.configurationReady() || authService.token) {
    return true;
  }

  return dataFacadeService.isConfigurationReady().pipe(
    map((value) => {
      if (!value) {
        return router.createUrlTree([RoutePath.CREATE_USER]);
      }

      return true;
    })
  );
};
