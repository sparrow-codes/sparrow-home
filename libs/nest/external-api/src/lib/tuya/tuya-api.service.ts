import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import { from, map, Observable, tap } from 'rxjs';

import { TuyaDeviceDetailsCloudModel } from '.';
import { Commands } from './model/commands';
import { TuyaTokenStore } from './tuya-token.store';

@Injectable()
export class TuyaApiService {
  protected connector: TuyaContext;

  public constructor(private readonly _configService: ConfigService) {
    this.connector = new TuyaContext({
      baseUrl: this._configService.get<string>(ConfigKey.TUYA_BASE_URL) ?? '',
      accessKey: this._configService.get<string>(ConfigKey.TUYA_ACCESS_KEY) ?? '',
      secretKey: this._configService.get<string>(ConfigKey.TUYA_SECRET_KEY) ?? '',
      version: 'v2',
      store: new TuyaTokenStore(),
    });
  }

  public getDeviceStatus(deviceId: string): Observable<TuyaDeviceDetailsCloudModel> {
    return from(
      this.connector.request<Commands<unknown>[]>({
        path: `/v1.0/iot-03/devices/${deviceId}/status`,
        method: 'GET',
      })
    ).pipe(
      tap((response) => Logger.log(response, 'Tuya Response:')),
      map((response) => {
        if (!response.success) {
          return { online: false } as TuyaDeviceDetailsCloudModel;
        }

        return { online: true, commands: response.result } as TuyaDeviceDetailsCloudModel;
      })
    );
  }

  public sendCommands<T>(deviceId: string, commands: Commands<T>[]): Observable<boolean> {
    return from(
      this.connector.request<boolean>({
        path: `/v1.0/iot-03/devices/${deviceId}/commands`,
        method: 'POST',
        body: {
          commands,
        },
      })
    ).pipe(
      tap((response) => Logger.log(response, 'Tuya Response:')),
      map((response) => {
        if (!response.success) {
          return false;
        }

        return response.result;
      })
    );
  }
}
