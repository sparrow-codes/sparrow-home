import { inject, Injectable } from '@angular/core';
import { AuthenticationApiService } from '@sparrow-home/api';
import { first, map, Observable, tap } from 'rxjs';

import { AuthService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WebAuthenticationService extends AuthService {
  private _token: string | null;
  private readonly authService: AuthenticationApiService = inject(AuthenticationApiService);

  private static readonly TOKEN_KEY: string = 'SP_ACCESS_TOKEN';

  public constructor() {
    super();
    this._token = localStorage.getItem(WebAuthenticationService.TOKEN_KEY);
  }

  public get token(): string | null {
    return this._token;
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
          localStorage.setItem(WebAuthenticationService.TOKEN_KEY, response.token);
          this._token = response.token;
        }),
        map(() => void 0)
      );
  }

  public logout(): void {
    localStorage.clear();
    this._token = null;
  }
}
