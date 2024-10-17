import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { GetHeatPumpDetailsResponse } from '~api/cloud/models/get-heat-pump-details-response';
import { CreateUserRequest } from '~api/user/models/create-user-request';
import { LoginRequest } from '~api/user/models/login-request';
import { AppConfig } from '~core/models/app-config';
import { Configuration } from '~core/models/configuration';
import { WaterTankOptions } from '~core/models/water-tank-options';
import { CloudStore } from '~core/stores/cloud-store';

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
  private readonly _cloudStore = inject(CloudStore);

  public get heatPump(): Signal<GetHeatPumpDetailsResponse | null> {
    return this._cloudStore.heatPump;
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

  public get isCloudStoreLoading(): Signal<boolean> {
    return this._cloudStore.isLoading;
  }

  public get isLoginError(): Signal<boolean> {
    return this._userStore.isLoginError;
  }

  public get configuration(): Signal<Configuration | null> {
    return this._setupStore.configuration;
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

  public get lowestTemperatureAtNight(): Signal<number | undefined> {
    return this._rootStore.lowestTemperatureAtNight;
  }

  public get applicationConfig(): Signal<AppConfig | null> {
    return this._rootStore.appConfig;
  }

  public get waterTankOptions(): Signal<WaterTankOptions | null> {
    return this._cloudStore.waterTankOptions;
  }

  public getHeatPumpDetails(): void {
    this._cloudStore.getHeatPumpDetails();
  }

  public setHeatPumpOperationStatus(isWaterOn: boolean, isHeatOn: boolean): void {
    this._cloudStore.changeOperationsStatus({ isWaterOn, isHeatOn });
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

  public saveConfiguration(configuration: Configuration): void {
    this._setupStore.setConfiguration(configuration);
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

  public fetchLowestTemperature(): void {
    this._rootStore.fetchLowestTemperature();
  }

  public saveAppConfig(appConfig: AppConfig): void {
    this._rootStore.saveAppConfig(appConfig);
  }

  public changeScheduledWaterHeatingStatus(status: boolean): void {
    this._cloudStore.setWaterHeatingStatus(status);
  }
}
