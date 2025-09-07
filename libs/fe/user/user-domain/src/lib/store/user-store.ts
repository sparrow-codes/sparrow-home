import { inject } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { finalize, first, Observable, pipe, switchMap, tap } from 'rxjs';

import { UserRole } from '../enum/user-role';
import { User } from '../model/user';

type UserState = {
  user: User | null;
  additionalUsers: User[] | null;
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ user: null, additionalUsers: null }),
  withMethods(
    (
      store,
      userApiService: UserApiService = inject(UserApiService),
      authService: AuthService = inject(AuthService),
      router: Router = inject(Router),
      loaderService = inject(LoaderService),
      messageService = inject(MessageService)
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
            error: () => messageService.add({ summary: 'Błąd pobierania listy użytkowników', severity: 'error' }),
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
                    messageService.add({ summary: 'Konfiguracja zakończona powodzeniem', severity: 'contrast' });
                    router.navigate([RoutePath.LOGIN]);
                  },
                  error: () =>
                    messageService.add({
                      summary: 'Konfiguracja zakończona niepowodzeniem',
                      severity: 'error',
                    }),
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
                    messageService.add({ summary: 'Użytkownik został utworzony!', severity: 'contrast' });
                    router.navigate([RoutePath.LOGIN]);
                  },
                  error: () =>
                    messageService.add({
                      summary: 'Błąd podczas tworzenia użytkownika!',
                      severity: 'error',
                    }),
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
            }),
            switchMap((request) =>
              authService.login(request.email, request.password).pipe(
                first(),
                tapResponse({
                  next: () => {
                    router.navigate([RoutePath.MAIN]).then(() => (loaderService.showLoader = false));
                  },
                  error: () => {
                    messageService.add({ summary: 'Niepoprawny login lub hasło!', severity: 'error' });
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
                  error: () =>
                    messageService.add({
                      summary: 'Błąd pobierania szczegółów użytkownika',
                      severity: 'error',
                    }),
                }),
                finalize(() => (loaderService.showLoader = false))
              )
            )
          )
        ),
        fetchAdditionalUsers: rxMethod<void>(pipe(switchMap(() => _getAdditionalUsers()))),
        activateUser: rxMethod<{ id: number; isActive: boolean }>(
          pipe(
            tap(() => (loaderService.showLoader = true)),
            switchMap((value) =>
              userApiService.activateUser({ body: { userId: value.id, isActive: value.isActive } }).pipe(
                tapResponse({
                  next: () => messageService.add({ summary: 'Zmieniono status użytkownika', severity: 'success' }),
                  error: () =>
                    messageService.add({
                      summary: 'Błąd podczas zmiany statusu użytkownika!',
                      severity: 'error',
                    }),
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
