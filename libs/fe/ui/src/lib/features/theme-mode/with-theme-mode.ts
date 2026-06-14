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
          rootElement.classList.add('dark');
        } else {
          rootElement.classList.remove('dark');
        }

        const themeColorFromCss: string = getComputedStyle(rootElement).getPropertyValue('--app-theme-color').trim();
        const themeColor: string = themeColorFromCss || (isDarkModeOn ? '#080C15' : '#F5F5F5');

        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
        document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', isDarkModeOn ? 'dark' : 'light');
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
