import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKey } from '../../../../enums/config-key';
import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';
import { HeatPump } from '../../controllers/models/panasonic-cloud-models';

@Injectable()
export class CloudConnectionService {
  public constructor(
    private readonly _connector: ComfortCloudConnector,
    private readonly _configService: ConfigService
  ) {}

  public async connectToPanasonicCloud(): Promise<void> {
    const userName: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return this._connector.login(userName, password);
  }

  public getHeatPumpDetails(): Promise<HeatPump> {
    return this._connector.getDeviceDetails();
  }
}
