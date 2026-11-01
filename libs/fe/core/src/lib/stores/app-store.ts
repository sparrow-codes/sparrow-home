import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DOCUMENT, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { SetupApiService } from '@sparrow-home/api';
import { withThemeMode } from '@sparrow-home/ui';
import { catchError, filter, first, map, Observable, of, switchMap } from 'rxjs';

import { AppConfig, Configuration } from '../models';
import { VisibilityService } from '../services/';
import { ToastService } from '../services/toast.service';
import { withAuthentication } from './features';

export type CoreState = {
  appConfig: AppConfig | null;
  isConfigurationReady: boolean | null;
  configuration: Configuration | null;
};

export type AppStore = InstanceType<typeof appStore>;

export const appStore = signalStore(
  { providedIn: 'root' },
  withState<CoreState>({
    appConfig: null,
    isConfigurationReady: null,
    configuration: null,
  }),
  withThemeMode(),
  withAuthentication(),
  withMethods((store, apiService = inject(SetupApiService), messageService = inject(ToastService)) => ({
    saveAppConfig: (appConfig: AppConfig): void => {
      patchState(store, { appConfig });
    },
    verifyConfigurationReady: (): Observable<boolean> => {
      return apiService.isConfigurationReady().pipe(
        first(),
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return of(false);
          }
          throw error;
        }),
        tapResponse({
          next: (value) => patchState(store, { isConfigurationReady: value }),
          error: () => messageService.add({ summary: 'Błąd pobierania konfiguracji!', severity: 'error' }),
        })
      );
    },
  })),
  withHooks(
    (
      _store,
      swUpdate: SwUpdate = inject(SwUpdate),
      alertController: AlertController = inject(AlertController),
      translateService: TranslateService = inject(TranslateService),
      visibilityService = inject(VisibilityService),
      document: Document = inject(DOCUMENT)
    ) => ({
      onInit: (): void => {
        visibilityService.listenToVisibilityChange();

        swUpdate.versionUpdates
          .pipe(
            filter((eventType) => eventType.type === 'VERSION_READY'),
            first(),
            switchMap(async () => {
              const alert = await alertController.create({
                message: translateService.instant('ui.new_version_available'),
                backdropDismiss: false,
                buttons: [translateService.instant('common.ok')],
              });

              await alert.present();
              await alert.onDidDismiss();
            })
          )
          .subscribe(() => document.location.reload());
      },
    })
  )
);
