import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { RoutePath } from '../enum';
import { APP_TITLE } from '../tokens';

export const pageTitleResolver: ResolveFn<string> = (route, state) => {
  const appTitle: string = inject(APP_TITLE, { optional: true }) ?? '';
  const url: string = state.url.replace('/', '');

  switch (url) {
    case RoutePath.CREATE_USER:
    case RoutePath.CREATE_ADDITIONAL_USER:
      return `${appTitle} - Nowy użytkownik`;
    case RoutePath.MAIN:
      return `${appTitle} - Panel Główny`;
    case RoutePath.LOGIN:
      return `${appTitle} - Logowanie`;
    case RoutePath.NOT_FOUND:
      return `${appTitle} - Strona nie istnieje`;
    case RoutePath.HEAT_PUMP:
      return `${appTitle} - Pompa Ciepła`;
    case RoutePath.AQUARIUM:
      return `${appTitle} - Akwarium`;
    case RoutePath.ALARM:
      return `${appTitle} - Alarm`;
    case RoutePath.USER_PROFILE:
      return `${appTitle} - Profil`;
    default:
      return `${appTitle}`;
  }
};
