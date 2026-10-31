import { DOCUMENT, inject } from '@angular/core';
import { patchState, signalStoreFeature, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

import { getUserMode, setUserMode } from './functions/get-user-mode';

export function withThemeMode() {
  return signalStoreFeature(
    withState<{ isDarkModeOn: boolean }>({ isDarkModeOn: false }),
    withProps((_store, document = inject(DOCUMENT)) => ({
      _applyThemeMode: (isDarkModeOn: boolean): void => {
        const rootElement: HTMLElement = document.documentElement;

        if (isDarkModeOn) {
          document.documentElement.classList.toggle('ion-palette-dark', true);
        } else {
          document.documentElement.classList.toggle('ion-palette-dark', false);
        }
      },
    })),
    withMethods((store) => ({
      toggleThemeMode: (): void => {
        const isDarkModeOn: boolean = !store.isDarkModeOn();
        store._applyThemeMode(isDarkModeOn);

        setUserMode(isDarkModeOn);
        patchState(store, { isDarkModeOn: isDarkModeOn });
      },
    })),
    withHooks((store) => ({
      onInit: (): void => {
        const isDarkModeOn: boolean = getUserMode();

        store._applyThemeMode(isDarkModeOn);
        patchState(store, { isDarkModeOn: isDarkModeOn });
      },
    }))
  );
}
