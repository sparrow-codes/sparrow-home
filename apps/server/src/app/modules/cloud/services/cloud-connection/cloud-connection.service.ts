import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

import { ConfigKey } from '../../../../enums/config-key';
import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';

@Injectable()
export class CloudConnectionService {
  public constructor(
    private readonly connector: ComfortCloudConnector,
    private readonly configService: ConfigService
  ) {}

  public async connectToPanasonicCloud(): Promise<void> {
    const userName: string = this.configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string = this.configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return this.connector.login(userName, password);
  }

  public getHeatPumpDetails(): Promise<HeatPump> {
    return this.connector.getDeviceDetails();
  }
}
