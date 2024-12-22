import { computed, inject, Injectable, Signal } from '@angular/core';
import { CreateUserRequest, GetHeatPumpDetailsResponse, LoginRequest } from '@sparrow-home/api';
import { Observable } from 'rxjs';

import { AppConfig } from '../models';
import { Configuration } from '../models';
import { WaterTankOptions } from '../models';
import { CloudStore } from '../stores/cloud-store';
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

  public get isLoginError(): Signal<boolean> {
    return this._userStore.isLoginError;
  }

  public get configuration(): Signal<Configuration | null> {
    return this._setupStore.configuration;
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

  public saveAppConfig(appConfig: AppConfig): void {
    this._rootStore.saveAppConfig(appConfig);
  }

  public changeScheduledWaterHeatingStatus(status: boolean): void {
    this._cloudStore.setWaterHeatingStatus(status);
  }
}
