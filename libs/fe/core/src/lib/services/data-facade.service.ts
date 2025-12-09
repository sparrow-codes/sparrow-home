import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from '../models';
import { AppStore, appStore } from '../stores/app-store';

@Injectable({
  providedIn: 'root',
})
export class DataFacadeService {
  private readonly _rootStore: AppStore = inject(appStore);

  public get configurationReady(): Signal<boolean | null> {
    return this._rootStore.isConfigurationReady;
  }

  public get applicationConfig(): Signal<AppConfig | null> {
    return this._rootStore.appConfig;
  }

  public isConfigurationReady(): Observable<boolean> {
    return this._rootStore.verifyConfigurationReady();
  }

  public saveAppConfig(appConfig: AppConfig): void {
    this._rootStore.saveAppConfig(appConfig);
  }
}
