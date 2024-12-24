import { Route } from '@angular/router';
import {
  authGuard,
  configurationNotReadyGuard,
  configurationReadyGuard,
  RoutePath,
  setupResolver,
} from '@sparrow-home/core';
import { FrameComponent, PageNotFoundComponent } from '@sparrow-home/ui';

import { CloudContainerComponent } from './features/cloud/containers/cloud-container/cloud-container.component';

export const appRoutes: Route[] = [
  {
    path: RoutePath.CREATE_USER,
    canActivate: [configurationNotReadyGuard],
    loadComponent: () =>
      import('./features/user/containers/create-user/create-user-page.component').then(
        (m) => m.CreateUserPageComponent
      ),
  },
  {
    path: RoutePath.LOGIN,
    loadComponent: () => import('./features/user/containers/login/login.component').then((c) => c.LoginComponent),
    canActivate: [configurationReadyGuard],
  },
  {
    path: '',
    component: FrameComponent,
    resolve: { data: setupResolver },
    canActivate: [configurationReadyGuard, authGuard],
    children: [
      {
        path: RoutePath.MAIN,
        loadChildren: () => import('@sparrow-home/tuya-device-feature').then((f) => f.tuyaDeviceRoutes),
      },
      {
        path: RoutePath.PANASONIC,
        component: CloudContainerComponent,
      },
      {
        path: RoutePath.NOT_FOUND,
        component: PageNotFoundComponent,
      },
      {
        path: '**',
        redirectTo: 'no-found',
      },
    ],
  },
];
