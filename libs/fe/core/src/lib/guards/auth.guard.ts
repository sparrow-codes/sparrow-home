import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { RoutePath } from '../enum';
import { AppStore, appStore } from '../stores/app-store';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router: Router = inject(Router);
  const store: AppStore = inject(appStore);
  return store.isAuthenticated() ? true : router.createUrlTree([RoutePath.LOGIN]);
};
