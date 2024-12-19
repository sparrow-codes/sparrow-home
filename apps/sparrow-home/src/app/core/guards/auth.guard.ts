import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { RoutePath } from '../enum/route-path';
import { DataFacadeService } from '../services/data-facade.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router: Router = inject(Router);
  const dataService: DataFacadeService = inject(DataFacadeService);
  return dataService.isUserLoggedIn() ? true : router.createUrlTree([RoutePath.LOGIN]);
};
