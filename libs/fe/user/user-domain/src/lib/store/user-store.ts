import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  CreateNewUserRequestApiModel,
  GetListOfAdditionalUsersResponseApiModel,
  LoginRequestApiModel,
  UserApiService,
} from '@sparrow-home/api';
import { AuthService, LoaderService, RoutePath } from '@sparrow-home/core';
import { finalize, first, Observable, pipe, switchMap, tap } from 'rxjs';

import { UserRole } from '../enum/user-role';
import { User } from '../model/user';

type UserState = {
  user: User | null;
  additionalUsers: User[] | null;
  isLoginError: boolean;
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ user: null, isLoginError: false, additionalUsers: null }),
  withMethods(
    (
      store,
      userApiService: UserApiService = inject(UserApiService),
      authService: AuthService = inject(AuthService),
      snackBar: MatSnackBar = inject(MatSnackBar),
      router: Router = inject(Router),
      loaderService = inject(LoaderService)
    ) => {
      function _getAdditionalUsers(): Observable<GetListOfAdditionalUsersResponseApiModel> {
        loaderService.showLoader = true;

        return userApiService.getListOfAdditionalUsers().pipe(
          tapResponse({
            next: (response) =>
              patchState(store, {
                additionalUsers: response.users.map((user) => ({
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  isActive: user.isActive,
                  role: UserRole.ADDITIONAL,
                })),
              }),
            error: () => snackBar.open('Błąd pobierania listy użytkowników'),
          }),
          finalize(() => (loaderService.showLoader = false))
        );
      }

      return {
        createFirstUser: rxMethod<CreateNewUserRequestApiModel>(
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
        createAdditionalUser: rxMethod<CreateNewUserRequestApiModel>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((request) =>
              userApiService.createAdditionalUser({ body: request }).pipe(
                first(),
                tapResponse({
                  next: () => {
                    snackBar.open('Użytkownik został utworzony!');
                    router.navigate([RoutePath.LOGIN]);
                  },
                  error: () => snackBar.open('Błąd podczas tworzenia użytkownika!'),
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
        fetchUserDetails: rxMethod<void>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap(() =>
              userApiService.getUserDetails().pipe(
                tapResponse({
                  next: (response) =>
                    patchState(store, {
                      user: {
                        id: response.id,
                        email: response.email,
                        firstName: response.firstName,
                        lastName: response.lastName ?? undefined,
                        role: response.role,
                      },
                    }),
                  error: () => snackBar.open('Błąd pobierania szczegółów użytkownika'),
                }),
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        fetchAdditionalUsers: rxMethod<void>(pipe(switchMap(() => _getAdditionalUsers()))),
        activateUser: rxMethod<number>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((userId) =>
              userApiService.activateUser({ body: { userId } }).pipe(
                tapResponse({
                  next: () => snackBar.open('Aktywowano użytkownika!'),
                  error: () => snackBar.open('Błąd podczas aktywacji użytkownika!'),
                }),
                switchMap(() => _getAdditionalUsers())
              )
            )
          )
        ),
      };
    }
  )
);
