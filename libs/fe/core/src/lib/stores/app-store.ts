import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { SetupApiService } from '@sparrow-home/api';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, filter, first, map, Observable, of, switchMap } from 'rxjs';

import { NewVersionDialogComponent } from '../components/new-version-dialog/new-version-dialog.component';
import { AppConfig, Configuration } from '../models';
import { VisibilityService } from '../services/';

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
  withMethods((store, apiService = inject(SetupApiService), messageService = inject(MessageService)) => ({
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
      dialog: DialogService = inject(DialogService),
      visibilityService = inject(VisibilityService),
      document: Document = inject(DOCUMENT)
    ) => ({
      onInit: (): void => {
        visibilityService.listenToVisibilityChange();

        swUpdate.versionUpdates
          .pipe(
            filter((eventType) => eventType.type === 'VERSION_READY'),
            first(),
            switchMap(
              () =>
                dialog.open(NewVersionDialogComponent, {
                  closable: false,
                  modal: true,
                })!.onClose
            )
          )
          .subscribe(() => document.location.reload());
      },
    })
  )
);
