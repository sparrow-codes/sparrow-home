import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from '../models';
import { appStore } from '../stores/app-store';
import { SetupStore } from '../stores/setup-store';

@Injectable({
  providedIn: 'root',
})
export class DataFacadeService {
  private readonly _rootStore = inject(appStore);
  private readonly _setupStore = inject(SetupStore);

  public get configurationReady(): Signal<boolean | null> {
    return this._setupStore.isConfigurationReady;
  }

  public get applicationConfig(): Signal<AppConfig | null> {
    return this._rootStore.appConfig;
  }

  public isConfigurationReady(): Observable<boolean> {
    return this._setupStore.verifyConfigurationReady();
  }

  public saveAppConfig(appConfig: AppConfig): void {
    this._rootStore.saveAppConfig(appConfig);
  }
}
