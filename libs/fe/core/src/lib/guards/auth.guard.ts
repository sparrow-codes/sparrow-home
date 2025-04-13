import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { RoutePath } from '../enum';
import { AuthService } from '../models';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  return authService.token ? true : router.createUrlTree([RoutePath.LOGIN]);
};
