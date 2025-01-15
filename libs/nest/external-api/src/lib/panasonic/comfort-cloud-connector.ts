import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { from, map, Observable, of, retry, switchMap, tap } from 'rxjs';

import { SetDeviceStatusRequestMapper } from './mapper/set-device-status-request.mapper';
import { HeatPump } from './models';
import { AccessToken } from './models/access-token';
import { ErrorMessage } from './models/error-message';
import { ErrorResponse } from './models/error-response';
import { OAuthClient } from './oauth-connector/OAuthConnector';

@Injectable()
export class ComfortCloudConnector {
  private _accessToken: string | null = null;

  private static readonly AQUAREA_URL: string = 'https://aquarea-smart.panasonic.com/remote/v1/api/devices';

  public constructor(
    private readonly _http: HttpService,
    private readonly _configService: ConfigService,
    private readonly _oAuthClient: OAuthClient
  ) {}

  public getAuthToken(): Observable<string> {
    if (this._accessToken) {
      return of(this._accessToken);
    }

    const userName: string | undefined = this._configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string | undefined = this._configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return from(this._oAuthClient.ensureAuthenticated(userName, password)).pipe(
      tap({
        next: (token) => (this._accessToken = token),
      })
    );
  }

  public getDeviceDetails(): Observable<HeatPump> {
    return of(void 0).pipe(
      switchMap(() => from(this.getAuthToken())),
      switchMap((accessToken) =>
        this._http
          .get<{ status: HeatPump[]; accessToken: AccessToken } | ErrorResponse>(
            `${ComfortCloudConnector.AQUAREA_URL}/${this._getHeatPumpDeviceId()}?var.deviceDirect=1`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: `accessToken=${accessToken};`,
                Origin: 'https://aquarea-smart.panasonic.com',
              },
            }
          )
          .pipe(
            tap((response) => Logger.log(response.data, 'Cloud Response Status')),
            map((response) => {
              if (this.isAuthError(response.data as ErrorResponse)) {
                this._accessToken = null;
                Logger.warn('Cloud Access Token expired');
                throw new UnauthorizedException('Access Token expired');
              }

              this._refreshToken((response.data as { status: HeatPump[]; accessToken: AccessToken }).accessToken);
              return (response.data as { status: HeatPump[] }).status[0];
            })
          )
      )
    );
  }

  public setDeviceStatus(isWaterOn: boolean, isHeatOn: boolean): Observable<void> {
    const deviceGuid: string = this._getHeatPumpDeviceId();

    return of(void 0).pipe(
      switchMap(() => this.getAuthToken()),
      switchMap((accessToken) =>
        this._http
          .post<ErrorResponse | { accessToken: AccessToken }>(
            `${ComfortCloudConnector.AQUAREA_URL}/${deviceGuid}`,
            SetDeviceStatusRequestMapper.map(isWaterOn, isHeatOn, deviceGuid),
            {
              headers: {
                'Content-Type': 'application/json',
                Cookie: `accessToken=${accessToken}; selectedDeviceId=${deviceGuid};`,
                Origin: 'https://aquarea-smart.panasonic.com',
                Referer: 'https://aquarea-smart.panasonic.com/remote/a2wStatusDisplay',
              },
            }
          )
          .pipe(
            tap((response) => Logger.log(response.data, 'Cloud Response Status')),
            map((response) => {
              if (this.isAuthError(response.data as ErrorResponse)) {
                this._accessToken = null;
                Logger.warn('Cloud Access Token expired');
                throw new Error('Unable to authenticate');
              }

              this._refreshToken((response.data as { accessToken: AccessToken }).accessToken);
              return void 0;
            })
          )
      ),
      retry({ count: 1, delay: 2000 })
    );
  }

  private _getHeatPumpDeviceId(): string {
    const deviceId: string | undefined = this._configService.get<string>(ConfigKey.PANASONIC_DEVICE_ID);
    if (!deviceId) {
      throw new InternalServerErrorException('No device id provided in application configuration');
    }

    return deviceId;
  }

  private isAuthError(response: ErrorResponse): boolean {
    const message: ErrorMessage[] | undefined = response.message;

    if (!message || message.length === 0) {
      return false;
    }

    return message[0].errorCode === '1001-0001';
  }

  private _refreshToken(accessToken: AccessToken): void {
    this._accessToken = accessToken.token;
  }
}
