import { DOCUMENT } from '@angular/common';
import { effect, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withTasks } from '@sparrow-home/task-domain';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, first, switchMap, tap } from 'rxjs';

import { NewVersionDialogComponent } from '../components/new-version-dialog/new-version-dialog.component';
import { AppConfig } from '../models';
import { LoaderService } from '../services';
import { VisibilityService } from '../services/';
import { RootState } from './model';

export type CoreState = RootState & {
  appConfig: AppConfig | null;
};

export type AppStore = InstanceType<typeof appStore>;

export const appStore = signalStore(
  { providedIn: 'root' },
  withState<CoreState>({
    isLoading: false,
    appConfig: null,
  }),
  withTasks(),
  withMethods((store) => ({
    saveAppConfig: (appConfig: AppConfig): void => {
      patchState(store, { appConfig });
    },
  })),
  withHooks(
    (
      _store,
      swUpdate: SwUpdate = inject(SwUpdate),
      dialog: DialogService = inject(DialogService),
      visibilityService = inject(VisibilityService),
      loaderService = inject(LoaderService),
      document: Document = inject(DOCUMENT)
    ) => ({
      onInit: (): void => {
        visibilityService.listenToVisibilityChange();

        swUpdate.versionUpdates
          .pipe(
            filter((eventType) => eventType.type === 'VERSION_READY'),
            first(),
            tap(() => patchState(_store, { isLoading: true })),
            switchMap(
              () =>
                dialog.open(NewVersionDialogComponent, {
                  closable: false,
                  header: 'Nowa wersja aplikacji',
                }).onClose
            )
          )
          .subscribe(() => document.location.reload());

        effect(() => {
          loaderService.showLoader = !!_store.isLoading();
        });
      },
    })
  )
);
