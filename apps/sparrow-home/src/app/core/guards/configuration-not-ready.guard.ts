import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { RoutePath } from '../enum/route-path';
import { DataFacadeService } from '../services/data-facade.service';

export const configurationNotReadyGuard: CanActivateFn = (): Observable<boolean | UrlTree> | boolean => {
  const router: Router = inject(Router);
  const dataService: DataFacadeService = inject(DataFacadeService);
  if (dataService.configurationReady()) {
    return false;
  }

  return dataService.isConfigurationReady().pipe(
    map((value) => {
      if (value) {
        return router.createUrlTree([RoutePath.LOGIN]);
      } else {
        return true;
      }
    })
  );
};
