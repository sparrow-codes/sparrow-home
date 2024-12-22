import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { RoutePath } from '../enum';
import { DataFacadeService } from '../services';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router: Router = inject(Router);
  const dataService: DataFacadeService = inject(DataFacadeService);
  return dataService.isUserLoggedIn() ? true : router.createUrlTree([RoutePath.LOGIN]);
};
