import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { HeatPump } from '~api/cloud/models/panasonic-cloud-models';
import { CreateUserRequest } from '~api/user/models/create-user-request';
import { LoginRequest } from '~api/user/models/login-request';

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

  public get heatPump(): Signal<HeatPump | null> {
    return this._rootStore.heatPump;
  }

  public get authToken(): string | null {
    return this._userStore.token();
  }

  public get isLoading(): Signal<boolean> {
    return this._rootStore.loading;
  }

  public get isUserStoreLoading(): Signal<boolean> {
    return this._userStore.isLoading;
  }

  public get isLoginError(): Signal<boolean> {
    return this._userStore.isLoginError;
  }

  public get currentMode(): Signal<number | null> {
    return this._setupStore.currentMode;
  }

  public get modeDictionary(): Signal<{ value: number; label: string }[]> {
    return this._setupStore.modeDictionary;
  }

  public get isUserLoggedIn(): Signal<boolean> {
    return computed(() => !!this._userStore.token());
  }

  public get configurationReady(): Signal<boolean | null> {
    return this._setupStore.isConfigurationReady;
  }

  public connectToCloudServices(): void {
    this._rootStore.connectToCloud();
  }

  public fetchWifiDeviceList(): void {
    this._rootStore.fetchDeviceList();
  }

  public setMode(mode: number): void {
    this._setupStore.setMode(mode);
  }

  public isConfigurationReady(): Observable<boolean> {
    return this._setupStore.verifyConfigurationReady();
  }

  public fetchCurrentConfiguration(): Observable<void> {
    return this._setupStore.getCurrentSetup();
  }

  public createFirstUser(request: CreateUserRequest): void {
    this._userStore.createUser(request);
  }

  public login(request: LoginRequest): void {
    this._userStore.login(request);
  }

  public logout(): void {
    this._userStore.logout();
  }
}
