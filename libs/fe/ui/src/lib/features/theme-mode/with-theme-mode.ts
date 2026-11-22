import { DOCUMENT, inject } from '@angular/core';
import { patchState, signalStoreFeature, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

import { applyThemeToDocument } from './functions/apply-theme-to-document';
import { getUserMode, setUserMode } from './functions/get-user-mode';

export function withThemeMode() {
  return signalStoreFeature(
    withState<{ isDarkModeOn: boolean }>({ isDarkModeOn: false }),
    withProps((_store, document = inject(DOCUMENT)) => ({
      _applyThemeMode: (isDarkModeOn: boolean): void => applyThemeToDocument(document, isDarkModeOn),
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
