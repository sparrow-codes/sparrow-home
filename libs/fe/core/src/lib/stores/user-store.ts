import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CreateUserRequest, LoginRequest, UserApiService } from '@sparrow-home/api';
import { first, pipe, switchMap, tap } from 'rxjs';

import { RoutePath } from '../enum/route-path';
import { User } from '../models/user';
import { LoaderService } from '../services';

type UserState = {
  user: User | null;
  token: string | null;
  isLoginError: boolean;
};

const tokenKey: string = 'SP_ACCESS_TOKEN';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ token: null, user: null, isLoginError: false }),
  withMethods(
    (
      store,
      userApiService: UserApiService = inject(UserApiService),
      snackBar: MatSnackBar = inject(MatSnackBar),
      router: Router = inject(Router),
      loaderService = inject(LoaderService)
    ) => ({
      createUser: rxMethod<CreateUserRequest>(
        pipe(
          tap(() => (loaderService.showLoader = true)),
          switchMap((request) =>
            userApiService.createUser(request).pipe(
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
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => {
            loaderService.showLoader = true;
            patchState(store, { isLoginError: false });
          }),
          switchMap((request) =>
            userApiService.login(request.email, request.password).pipe(
              first(),
              tapResponse({
                next: (response) => {
                  patchState(store, { token: response.token });
                  localStorage.setItem(tokenKey, response.token);
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
        localStorage.clear();
        patchState(store, { token: null });
        router.navigate([RoutePath.LOGIN]);
      },
    })
  ),
  withHooks((store) => ({
    onInit: (): void => patchState(store, { token: localStorage.getItem(tokenKey) }),
  }))
);
