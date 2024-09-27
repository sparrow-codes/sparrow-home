import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { HeatPump } from '@shared-models/panasonic-cloud-models';
import { Axios } from 'axios';

import { OAuthClient } from './OAuthConnector';

@Injectable()
export class ComfortCloudConnector {
  private accessToken: string;
  private axios: Axios;

  private readonly oAuthClient: OAuthClient = new OAuthClient();

  public constructor(private readonly http: HttpService) {
    this.axios = this.http.axiosRef;
  }

  public async login(username: string, password: string): Promise<void> {
    await this.oAuthClient.ensureAuthenticated(username, password);
  }

  public async getDeviceDetails(): Promise<HeatPump> {
    const dispalyResponse = await this.axios.get(
      'https://aquarea-smart.panasonic.com/remote/a2wStatusDisplay',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `accessToken=${this.oAuthClient.accessToken};`,
          Origin: 'https://aquarea-smart.panasonic.com',
        },
      }
    );

    const selectedDeviceId = dispalyResponse.data.match(/var selectedDeviceId = '(.+?)';/i)[1];
    const detailsResponse = await this.axios.get(
      `https://aquarea-smart.panasonic.com/remote/v1/api/devices/${selectedDeviceId}?var.deviceDirect=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `accessToken=${this.oAuthClient.accessToken};`,
          Origin: 'https://aquarea-smart.panasonic.com',
        },
      }
    );

    return detailsResponse.data.status[0];
  }
}
