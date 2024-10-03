import { Route } from '@angular/router';

import { RoutePath } from '~core/enum/route-path';
import { authGuard } from '~core/guards/auth.guard';
import { configurationNotReadyGuard } from '~core/guards/configuration-not-ready.guard';
import { configurationReadyGuard } from '~core/guards/configuration-ready.guard';

import { CloudContainerComponent } from './features/cloud/containers/cloud-container/cloud-container.component';
import { MainComponent } from './features/main/components/home/main.component';
import { FrameComponent } from './ui/components/frame/frame.component';

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
