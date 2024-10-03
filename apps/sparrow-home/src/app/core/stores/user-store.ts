import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SpToastService } from '@sparrow-codes/sparrow-ui';
import { first, pipe, switchMap, tap } from 'rxjs';

import { CreateUserRequest } from '~api/user/models/create-user-request';
import { LoginRequest } from '~api/user/models/login-request';
import { UserApiService } from '~api/user/user-api.service';
import { RoutePath } from '~core/enum/route-path';

import { User } from '../models/user';

type UserState = {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  isLoginError: boolean;
};

const tokenKey: string = 'SP_ACCESS_TOKEN';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ token: null, isLoading: false, user: null, isLoginError: false }),
  withMethods(
    (
      store,
      userApiService: UserApiService = inject(UserApiService),
      toastService: SpToastService = inject(SpToastService),
      router: Router = inject(Router)
    ) => ({
      createUser: rxMethod<CreateUserRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((request) =>
            userApiService.createUser(request).pipe(
              first(),
              tapResponse({
                next: () => {
                  toastService.success('Konfiguracja', 'Konfiguracja zakończona powodzeniem');
                  router.navigate([RoutePath.LOGIN]);
                },
                error: () => toastService.danger('Konfiguracja', 'Konfiguracja zakończona niepowodzeniem'),
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((request) =>
            userApiService.login(request.email, request.password).pipe(
              first(),
              tapResponse({
                next: (response) => {
                  patchState(store, { token: response.token });
                  localStorage.setItem(tokenKey, response.token);
                  router.navigate([RoutePath.MAIN]);
                },
                error: () => patchState(store, { isLoginError: true }),
                finalize: () => patchState(store, { isLoading: false }),
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
