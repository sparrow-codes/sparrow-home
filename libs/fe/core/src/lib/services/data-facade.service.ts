import { inject, Injectable, Signal } from '@angular/core';
import { CreateNewUserRequestApiModel, LoginRequestApiModel } from '@sparrow-home/api';
import { Observable } from 'rxjs';

import { AppConfig } from '../models';
import { RootStore } from '../stores/root-store';
import { SetupStore } from '../stores/setup-store';
import { UserStore } from '../stores/user-store';

@Injectable({
  providedIn: 'root',
})
export class DataFacadeService {
  private readonly _rootStore = inject(RootStore);
  private readonly _setupStore = inject(SetupStore);
  private readonly _userStore = inject(UserStore);

  public get isLoginError(): Signal<boolean> {
    return this._userStore.isLoginError;
  }

  public get isUserLoggedIn(): Signal<boolean> {
    return this._userStore.isUserLoggedIn;
  }

  public get configurationReady(): Signal<boolean | null> {
    return this._setupStore.isConfigurationReady;
  }

  public get applicationConfig(): Signal<AppConfig | null> {
    return this._rootStore.appConfig;
  }

  public isConfigurationReady(): Observable<boolean> {
    return this._setupStore.verifyConfigurationReady();
  }

  public fetchCurrentConfiguration(): Observable<void> {
    return this._setupStore.getCurrentSetup();
  }

  public createFirstUser(request: CreateNewUserRequestApiModel): void {
    this._userStore.createUser(request);
  }

  public login(request: LoginRequestApiModel): void {
    this._userStore.login(request);
  }

  public logout(): void {
    this._userStore.logout();
  }

  public saveAppConfig(appConfig: AppConfig): void {
    this._rootStore.saveAppConfig(appConfig);
  }
}
