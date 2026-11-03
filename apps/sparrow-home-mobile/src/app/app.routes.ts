import { Route } from '@angular/router';
import {
  bootstrapColumnsGap,
  bootstrapDeviceHdd,
  bootstrapDeviceHddFill,
  bootstrapGear,
  bootstrapGearFill,
  bootstrapHouse,
  bootstrapHouseFill,
  bootstrapPlayCircle,
  bootstrapPlayCircleFill,
} from '@ng-icons/bootstrap-icons';
import { provideIcons } from '@ng-icons/core';
import { authGuard, configurationNotReadyGuard, configurationReadyGuard, RoutePath } from '@sparrow-home/core';
import { MobileFrameComponent, NavigationItem, PageNotFoundComponent } from '@sparrow-home/ui';

export const appRoutes: Route[] = [
  {
    path: RoutePath.CREATE_USER,
    canActivate: [configurationNotReadyGuard],
    loadComponent: () => import('@sparrow-home/user-feature').then((feature) => feature.CreateUserPageComponent),
  },
  {
    path: RoutePath.LOGIN,
    data: {
      createNewUserLink: RoutePath.CREATE_ADDITIONAL_USER,
    },
    loadComponent: () => import('@sparrow-home/user-feature').then((feature) => feature.LoginComponent),
    canActivate: [configurationReadyGuard],
  },
  {
    path: RoutePath.CREATE_ADDITIONAL_USER,
    loadComponent: () => import('@sparrow-home/user-feature').then((feature) => feature.CreateAdditionalUserComponent),
  },
  {
    path: '',
    component: MobileFrameComponent,
    providers: [
      provideIcons({
        bootstrapHouse,
        bootstrapColumnsGap,
        bootstrapGear,
        bootstrapPlayCircle,
        bootstrapHouseFill,
        bootstrapPlayCircleFill,
        bootstrapGearFill,
        bootstrapDeviceHdd,
        bootstrapDeviceHddFill,
      }),
    ],
    data: {
      loginPath: RoutePath.LOGIN,
      profilePath: RoutePath.USER_PROFILE,
      navigationItems: [
        {
          label: 'ui.navigation.main',
          icon: 'bootstrapHouse',
          activeIcon: 'bootstrapHouseFill',
          routerLink: RoutePath.MAIN,
        },
        {
          label: 'ui.navigation.devices',
          icon: 'bootstrapDeviceHdd',
          activeIcon: 'bootstrapDeviceHddFill',
          routerLink: RoutePath.DEVICES,
        },
        {
          label: 'ui.navigation.automation',
          icon: 'bootstrapPlayCircle',
          activeIcon: 'bootstrapPlayCircleFill',
          routerLink: RoutePath.AUTOMATION,
        },
        {
          label: 'ui.navigation.settings',
          icon: 'bootstrapGear',
          activeIcon: 'bootstrapGearFill',
          routerLink: RoutePath.USER_PROFILE,
        },
      ] as NavigationItem[],
    },
    canActivate: [configurationReadyGuard, authGuard],
    children: [
      {
        path: RoutePath.MAIN,
        loadChildren: () => import('@sparrow-home/main-panel-feature').then((f) => f.mainPanelFeatureRoutes),
      },
      {
        path: RoutePath.NOT_FOUND,
        component: PageNotFoundComponent,
      },
      {
        path: RoutePath.USER_PROFILE,
        loadComponent: () => import('@sparrow-home/user-feature').then((feature) => feature.UserDetailsComponent),
      },
      {
        path: RoutePath.DEVICES,
        loadChildren: () => import('@sparrow-home/home-device-feature').then((feature) => feature.homeDeviceRoutes),
      },
      {
        path: RoutePath.AUTOMATION,
        loadChildren: () => import('@sparrow-home/task-feature').then((feature) => feature.TASK_ROUTES),
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
