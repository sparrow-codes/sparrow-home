import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { first, firstValueFrom, from, Observable, switchMap } from 'rxjs';

import { ConfigKey } from '../../../../enums/config-key';
import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';
import { SetHeatPumpStatusRequest } from '../../controllers/models/set-heat-pump-status.request';
import { HeatPump } from '../../models/panasonic-cloud-models';

@Injectable()
export class CloudConnectionService {
  public constructor(
    private readonly _connector: ComfortCloudConnector,
    private readonly _configService: ConfigService
  ) {}

  public removeAuthToken(): void {
    this._connector.logout();
  }

  public getHeatPumpDetails(): Observable<HeatPump> {
    return from(this._connectToPanasonicCloud()).pipe(
      first(),
      switchMap(() => this._connector.getDeviceDetails())
    );
  }

  public async setHeatOnly(isHeatOn: boolean): Promise<void> {
    await this._connectToPanasonicCloud();
    const heatPump: HeatPump = await this._connector.getDeviceDetails();
    const isWaterOn: boolean = heatPump.tankStatus[0].operationStatus === 1;
    await this.setHeatPumpOperationMode({ isWaterOn, isHeatOn, deviceGuid: heatPump.deviceGuid });
    Logger.log(`Setting heat: ${isHeatOn ? 'ON' : 'OFF'}`);
  }

  public async setHeatPumpOperationMode(request: SetHeatPumpStatusRequest): Promise<void> {
    await this._connectToPanasonicCloud();
    await firstValueFrom(this._connector.setDeviceStatus(request.isWaterOn, request.isHeatOn, request.deviceGuid));
  }

  private async _connectToPanasonicCloud(): Promise<void> {
    const userName: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return this._connector.login(userName, password);
  }
}
