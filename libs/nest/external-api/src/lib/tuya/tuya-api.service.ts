import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import { from, map, Observable, tap } from 'rxjs';

import { TuyaDeviceDetailsCloudModel } from '.';
import { Commands } from './model/commands';
import { TuyaTokenStore } from './tuya-token.store';

@Injectable()
export abstract class TuyaApiService {
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

  public getDeviceDetails(id: string): Observable<TuyaDeviceDetailsCloudModel> {
    return from(this.connector.device.detail({ device_id: id })).pipe(
      tap((response) => Logger.log(response, 'Tuya Response:')),
      map((response) => {
        if (response.success === false) {
          throw new NotFoundException(`No Tuya device found for id: ${id}`);
        }

        return response.result;
      })
    );
  }

  protected sendCommands<T>(deviceId: string, commands: Commands<T>[]): Observable<boolean> {
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
