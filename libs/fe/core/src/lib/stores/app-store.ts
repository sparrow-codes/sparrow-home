import { effect, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withTasks } from '@sparrow-home/task-domain';

import { AppConfig } from '../models';
import { LoaderService } from '../services';
import { VisibilityService } from '../services/';
import { NewVersionService } from '../services/new-version.service';
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
      visibilityService = inject(VisibilityService),
      newVersionService = inject(NewVersionService),
      loaderService = inject(LoaderService)
    ) => ({
      onInit: (): void => {
        visibilityService.listenToVisibilityChange();
        newVersionService.listenToNewVersionChange();

        effect(() => {
          loaderService.showLoader = !!_store.isLoading();
        });
      },
    })
  )
);
