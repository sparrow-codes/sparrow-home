import { inject, Injector } from '@angular/core';
import { computed, Signal } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { AuthenticationApiService } from '@sparrow-home/api';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { firstValueFrom } from 'rxjs';

import { MobilePushNotificationService } from '../../services/mobile-push-notification.service';

const TOKEN_KEY: string = 'SP_ACCESS_TOKEN';

export type AuthenticationState = {
  token: string | null;
};

export function withAuthentication() {
  return signalStoreFeature(
    withState<AuthenticationState>({ token: null }),
    withComputed((store) => ({
      isAuthenticated: computed((): boolean => !!store.token()) as Signal<boolean>,
    })),
    withMethods((store, authApiService = inject(AuthenticationApiService), injector = inject(Injector)) => ({
      login: async (email: string, password: string): Promise<void> => {
        const response = await firstValueFrom(authApiService.login({ body: { email, password } }));

        patchState(store, { token: response.token });
        // resolved lazily to avoid a circular dependency (push service -> HttpClient -> auth interceptor -> appStore)
        injector.get(MobilePushNotificationService).subscribeToNotifications();

        await SecureStoragePlugin.set({ key: TOKEN_KEY, value: response.token });
      },
      logout: (): void => {
        patchState(store, { token: null });
        SecureStoragePlugin.clear();
      },
    })),
    withHooks((store) => ({
      onInit: (): void => {
        SecureStoragePlugin.get({ key: TOKEN_KEY })
          .then((result) => patchState(store, { token: result.value }))
          .catch(() => patchState(store, { token: null }));
      },
    }))
  );
}
