import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateUserRequest } from './models/create-user-request';
import { LoginRequest } from './models/login-request';
import { LoginResponse } from './models/login-response';
import { RefreshTokenResponse } from './models/refresh-token-response';

enum USER_URLS {
  CREATE_USER = 'user/create-first',
  LOGIN = 'auth/login',
  REFRESH_TOKEN = 'auth/refresh',
}

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public createUser(request: CreateUserRequest): Observable<void> {
    return this._http.post<void>(USER_URLS.CREATE_USER, request);
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(USER_URLS.LOGIN, { email, password } as LoginRequest);
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    return this._http.get<RefreshTokenResponse>(USER_URLS.REFRESH_TOKEN);
  }
}
