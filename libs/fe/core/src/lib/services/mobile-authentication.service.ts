import { inject, Injectable } from '@angular/core';
import { AuthenticationApiService } from '@sparrow-home/api';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { first, map, Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MobileAuthenticationService extends AuthService {
  private _token: string | null = null;
  private readonly authService: AuthenticationApiService = inject(AuthenticationApiService);

  private static readonly TOKEN_KEY: string = 'SP_ACCESS_TOKEN';

  public override get token(): string | null {
    return this._token;
  }

  public constructor() {
    super();
    SecureStoragePlugin.get({ key: MobileAuthenticationService.TOKEN_KEY }).then(
      (token) => (this._token = token.value)
    );
  }

  public override logout(): void {
    this._token = null;
    SecureStoragePlugin.clear();
  }

  public override login(email: string, password: string): Observable<void> {
    return this.authService
      .login({
        body: {
          email,
          password,
        },
      })
      .pipe(
        first(),
        tap((response) => (this._token = response.token)),
        switchMap((response) =>
          SecureStoragePlugin.set({ key: MobileAuthenticationService.TOKEN_KEY, value: response.token })
        ),
        map(() => void 0)
      );
  }
}
