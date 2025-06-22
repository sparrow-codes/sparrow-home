import { inject, Injectable } from '@angular/core';
import { AuthenticationApiService } from '@sparrow-home/api';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { first, map, Observable, switchMap, tap } from 'rxjs';

import { MobilePushNotificationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string | null = null;
  private readonly authService: AuthenticationApiService = inject(AuthenticationApiService);
  private readonly _pushNotificationService: MobilePushNotificationService = inject(MobilePushNotificationService);

  private static readonly TOKEN_KEY: string = 'SP_ACCESS_TOKEN';

  public get token(): string | null {
    return this._token;
  }

  public constructor() {
    SecureStoragePlugin.get({ key: AuthService.TOKEN_KEY }).then(
      (token) => (this._token = token.value)
    );
  }

  public logout(): void {
    this._token = null;
    SecureStoragePlugin.clear();
  }

  public login(email: string, password: string): Observable<void> {
    return this.authService
      .login({
        body: {
          email,
          password,
        },
      })
      .pipe(
        first(),
        tap((response) => {
          this._token = response.token;
          this._pushNotificationService.subscribeToNotifications();
        }),
        switchMap((response) =>
          SecureStoragePlugin.set({ key: AuthService.TOKEN_KEY, value: response.token })
        ),
        map(() => void 0)
      );
  }
}
