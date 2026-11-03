import { DOCUMENT, inject } from '@angular/core';
import { patchState, signalStoreFeature, withHooks, withMethods, withProps, withState } from '@ngrx/signals';

import { getUserMode, setUserMode } from './functions/get-user-mode';

const LIGHT_THEME_COLOR: string = '#f3f4f6';
const DARK_THEME_COLOR: string = '#10151c';

export function withThemeMode() {
  return signalStoreFeature(
    withState<{ isDarkModeOn: boolean }>({ isDarkModeOn: false }),
    withProps((_store, document = inject(DOCUMENT)) => ({
      _applyThemeMode: (isDarkModeOn: boolean): void => {
        document.documentElement.classList.toggle('ion-palette-dark', isDarkModeOn);
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', isDarkModeOn ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
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
