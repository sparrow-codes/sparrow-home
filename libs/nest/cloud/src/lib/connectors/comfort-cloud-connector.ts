import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Axios, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { HeatPump } from '../models/panasonic-cloud-models';
import { OperationModeMapper } from './mapper/operation-mode.mapper';
import { SetOperationModeRequest } from './models/set-operation-mode-request';
import { OAuthClient } from './OAuthConnector';

@Injectable()
export class ComfortCloudConnector {
  private axios: Axios;

  private readonly _oAuthClient: OAuthClient = new OAuthClient();

  public constructor(private readonly http: HttpService) {
    this.axios = this.http.axiosRef;
  }

  public async login(username: string, password: string): Promise<void> {
    await this._oAuthClient.ensureAuthenticated(username, password);
  }

  public async getDeviceDetails(): Promise<HeatPump> {
    const dispalyResponse = await this.axios.get('https://aquarea-smart.panasonic.com/remote/a2wStatusDisplay', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `accessToken=${this._oAuthClient.accessToken};`,
        Origin: 'https://aquarea-smart.panasonic.com',
      },
    });

    const selectedDeviceId = dispalyResponse.data.match(/var selectedDeviceId = '(.+?)';/i)[1];
    const detailsResponse = await this.axios.get(
      `https://aquarea-smart.panasonic.com/remote/v1/api/devices/${selectedDeviceId}?var.deviceDirect=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `accessToken=${this._oAuthClient.accessToken};`,
          Origin: 'https://aquarea-smart.panasonic.com',
        },
      }
    );

    return detailsResponse.data.status[0];
  }

  public setDeviceStatus(isWaterOn: boolean, isHeatOn: boolean, deviceGuid: string): Observable<AxiosResponse<void>> {
    return this.http.post<void>(
      `https://aquarea-smart.panasonic.com/remote/v1/api/devices/${deviceGuid}`,
      this._prepareSetDeviceStatusRequest(isWaterOn, isHeatOn, deviceGuid),
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `accessToken=${this._oAuthClient.accessToken}; selectedDeviceId=${deviceGuid};`,
          Origin: 'https://aquarea-smart.panasonic.com',
          Referer: 'https://aquarea-smart.panasonic.com/remote/a2wStatusDisplay',
        },
      }
    );
  }

  public _prepareSetDeviceStatusRequest(
    isWaterOn: boolean,
    isHeatOn: boolean,
    deviceGuid: string
  ): SetOperationModeRequest {
    return {
      status: [
        {
          deviceGuid: deviceGuid,
          operationStatus: isWaterOn || isHeatOn ? 1 : 0,
          operationMode: OperationModeMapper.map(isWaterOn, isHeatOn),
          tankStatus: [{ operationStatus: isWaterOn ? 1 : 0 }],
          zoneStatus: [
            {
              zoneId: 1,
              operationStatus: isHeatOn ? 1 : 0,
            },
            {
              zoneId: 2,
              operationStatus: 0,
            },
          ],
        },
      ],
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { name: 'Cloud Access Token Reset' })
  public clearAuthToken(): void {
    this._oAuthClient.accessToken = '';
    Logger.log('Scheduled reset cloud access token');
  }
}
