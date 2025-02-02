import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CreateNewUserRequestApiModel, LoginRequestApiModel, UserApiService } from '@sparrow-home/api';
import { first, pipe, switchMap, tap } from 'rxjs';

import { RoutePath } from '../enum/route-path';
import { AuthService } from '../models';
import { User } from '../models/user';
import { LoaderService, WebAuthenticationService } from '../services';

type UserState = {
  user: User | null;
  isLoginError: boolean;
  isUserLoggedIn: boolean;
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ user: null, isLoginError: false, isUserLoggedIn: false }),
  withMethods(
    (
      store,
      userApiService: UserApiService = inject(UserApiService),
      authService: AuthService = inject(AuthService),
      snackBar: MatSnackBar = inject(MatSnackBar),
      router: Router = inject(Router),
      loaderService = inject(LoaderService)
    ) => ({
      createUser: rxMethod<CreateNewUserRequestApiModel>(
        pipe(
          tap(() => (loaderService.showLoader = true)),
          switchMap((request) =>
            userApiService.createNewUser({ body: request }).pipe(
              first(),
              tapResponse({
                next: () => {
                  snackBar.open('Konfiguracja zakończona powodzeniem', 'Zamknij');
                  router.navigate([RoutePath.LOGIN]);
                },
                error: () => snackBar.open('Konfiguracja zakończona niepowodzeniem', 'Zamknij'),
                finalize: () => (loaderService.showLoader = false),
              })
            )
          )
        )
      ),
      login: rxMethod<LoginRequestApiModel>(
        pipe(
          tap(() => {
            loaderService.showLoader = true;
            patchState(store, { isLoginError: false });
          }),
          switchMap((request) =>
            authService.login(request.email, request.password).pipe(
              first(),
              tapResponse({
                next: () => {
                  patchState(store, { isUserLoggedIn: true });
                  router.navigate([RoutePath.MAIN]).then(() => (loaderService.showLoader = false));
                },
                error: () => {
                  patchState(store, { isLoginError: true });
                  loaderService.showLoader = false;
                },
              })
            )
          )
        )
      ),
      logout: (): void => {
        authService.logout();
        router.navigate([RoutePath.LOGIN]);
      },
    })
  ),
  withHooks((store, authService = inject(WebAuthenticationService)) => ({
    onInit: (): void => patchState(store, { isUserLoggedIn: !!authService.token }),
  }))
);
