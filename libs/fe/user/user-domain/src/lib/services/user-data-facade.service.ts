import { inject, Injectable, Signal } from '@angular/core';
import { CreateNewUserRequestApiModel, LoginRequestApiModel } from '@sparrow-home/api';

import { User } from '../model';
import { UserStore } from '../store/user-store';

@Injectable({
  providedIn: 'root',
})
export class UserDataFacadeService {
  private readonly _userStore = inject(UserStore);

  public get isLoginError(): Signal<boolean> {
    return this._userStore.isLoginError;
  }

  public get user(): Signal<User | null> {
    return this._userStore.user;
  }

  public get additionalUsers(): Signal<User[] | null> {
    return this._userStore.additionalUsers;
  }

  public createFirstUser(request: CreateNewUserRequestApiModel): void {
    this._userStore.createFirstUser(request);
  }

  public createAdditionalUser(request: CreateNewUserRequestApiModel): void {
    this._userStore.createAdditionalUser(request);
  }

  public fetchAdditionalUsers(): void {
    this._userStore.fetchAdditionalUsers();
  }

  public activateUser(userId: number): void {
    this._userStore.activateUser(userId);
  }

  public login(request: LoginRequestApiModel): void {
    this._userStore.login(request);
  }

  public logout(): void {
    this._userStore.logout();
  }

  public fetchUserDetails(): void {
    this._userStore.fetchUserDetails();
  }
}
