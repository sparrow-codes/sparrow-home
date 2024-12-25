import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import { from, map, Observable } from 'rxjs';

import { TuyaDeviceDetailsCloudModel } from './model/tuya-device-details-cloud-model';

@Injectable()
export class TuyaApiService {
  private _connector: TuyaContext;

  public constructor(private readonly _configService: ConfigService) {
    this._connector = new TuyaContext({
      baseUrl: this._configService.get<string>(ConfigKey.TUYA_BASE_URL) ?? '',
      accessKey: this._configService.get<string>(ConfigKey.TUYA_ACCESS_KEY) ?? '',
      secretKey: this._configService.get<string>(ConfigKey.TUYA_SECRET_KEY) ?? '',
    });
  }

  public getDeviceDetails(id: string): Observable<TuyaDeviceDetailsCloudModel> {
    return from(this._connector.device.detail({ device_id: id })).pipe(map((response) => response.result));
  }
}
