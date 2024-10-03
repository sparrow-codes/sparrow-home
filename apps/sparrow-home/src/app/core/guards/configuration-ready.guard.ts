import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { RoutePath } from '~core/enum/route-path';

import { DataFacadeService } from '../services/data-facade.service';

export const configurationReadyGuard: CanActivateFn = (): Observable<boolean | UrlTree> | boolean => {
  const dataFacadeService: DataFacadeService = inject(DataFacadeService);
  const router: Router = inject(Router);

  if (dataFacadeService.configurationReady() || dataFacadeService.isUserLoggedIn()) {
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
