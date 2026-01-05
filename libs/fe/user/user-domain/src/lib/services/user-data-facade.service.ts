import { inject, Injectable, Signal } from '@angular/core';
import { CreateNewUserRequestApiModel, LoginRequestApiModel } from '@sparrow-home/api';
import { Observable } from 'rxjs';

import { User } from '../model';
import { UserStore, userStore } from '../store/user-store';

@Injectable({
  providedIn: 'root',
})
export class UserDataFacadeService {
  private readonly _userStore: UserStore = inject(userStore);

  public get user(): Signal<User | null> {
    return this._userStore.user;
  }

  public get additionalUsers(): Signal<User[] | null> {
    return this._userStore.additionalUsers;
  }

  public get isLoading$(): Observable<boolean> {
    return this._userStore.isLoading$;
  }

  public get isRefreshing(): Observable<boolean> {
    return this._userStore.isRefreshing$;
  }

  public createFirstUser(request: CreateNewUserRequestApiModel): void {
    this._userStore.createFirstUser(request);
  }

  public createAdditionalUser(request: CreateNewUserRequestApiModel): void {
    this._userStore.createAdditionalUser(request);
  }

  public activateUser(userId: number, isActive: boolean): void {
    this._userStore.activateUser({ id: userId, isActive });
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
