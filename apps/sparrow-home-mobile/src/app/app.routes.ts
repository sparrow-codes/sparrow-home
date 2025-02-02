import { Route } from '@angular/router';
import {
  authGuard,
  configurationNotReadyGuard,
  configurationReadyGuard,
  pageTitleResolver,
  RoutePath,
  setupResolver,
} from '@sparrow-home/core';
import { MobileFrameComponent, PageNotFoundComponent } from '@sparrow-home/ui';

export const appRoutes: Route[] = [
  {
    path: RoutePath.CREATE_USER,
    title: pageTitleResolver,
    canActivate: [configurationNotReadyGuard],
    loadComponent: () => import('@sparrow-home/user-feature').then((m) => m.CreateUserPageComponent),
  },
  {
    path: RoutePath.LOGIN,
    title: pageTitleResolver,
    loadComponent: () => import('@sparrow-home/user-feature').then((c) => c.LoginComponent),
    canActivate: [configurationReadyGuard],
  },
  {
    path: '',
    component: MobileFrameComponent,
    resolve: { data: setupResolver },
    canActivate: [configurationReadyGuard, authGuard],
    children: [
      {
        path: RoutePath.MAIN,
        title: pageTitleResolver,
        loadChildren: () => import('@sparrow-home/home-device-feature').then((f) => f.homeDeviceRoutes),
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
