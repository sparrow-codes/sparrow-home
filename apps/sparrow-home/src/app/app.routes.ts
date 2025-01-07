import { Route } from '@angular/router';
import {
  authGuard,
  configurationNotReadyGuard,
  configurationReadyGuard,
  pageTitleResolver,
  RoutePath,
  setupResolver,
} from '@sparrow-home/core';
import { FrameComponent, PageNotFoundComponent } from '@sparrow-home/ui';

export const appRoutes: Route[] = [
  {
    path: RoutePath.CREATE_USER,
    title: pageTitleResolver,
    canActivate: [configurationNotReadyGuard],
    loadComponent: () =>
      import('./features/user/containers/create-user/create-user-page.component').then(
        (m) => m.CreateUserPageComponent
      ),
  },
  {
    path: RoutePath.LOGIN,
    title: pageTitleResolver,
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
        title: pageTitleResolver,
        loadChildren: () => import('@sparrow-home/tuya-device-feature').then((f) => f.tuyaDeviceRoutes),
      },
      {
        path: RoutePath.HEAT_PUMP,
        title: pageTitleResolver,
        loadChildren: () => import('@sparrow-home/heat-pump-feature').then((feature) => feature.heatPumpRoutes),
      },
      {
        path: RoutePath.AQUARIUM,
        title: pageTitleResolver,
        loadChildren: () => import('@sparrow-home/aqua-feature').then((feature) => feature.aquaFeatureRoutes),
      },
      {
        path: RoutePath.NOT_FOUND,
        title: pageTitleResolver,
        component: PageNotFoundComponent,
      },
      {
        path: '',
        redirectTo: RoutePath.MAIN,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: RoutePath.NOT_FOUND,
      },
    ],
  },
];
