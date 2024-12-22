import { Route } from '@angular/router';
import {
  authGuard,
  configurationNotReadyGuard,
  configurationReadyGuard,
  RoutePath,
  setupResolver,
} from '@sparrow-home/core';
import { FrameComponent } from '@sparrow-home/ui';

import { CloudContainerComponent } from './features/cloud/containers/cloud-container/cloud-container.component';
import { MainComponent } from './features/main/containers/main/main.component';

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
        component: MainComponent,
      },
      {
        path: RoutePath.PANASONIC,
        component: CloudContainerComponent,
      },
      {
        path: '**',
        redirectTo: RoutePath.MAIN,
      },
    ],
  },
];
