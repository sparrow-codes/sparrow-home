import { Injectable } from '@nestjs/common';
import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

@Injectable()
export class CloudConnectionService {
  private readonly userName: string = 'feret.katarzyna@gmail.com';
  private readonly password: string = 'Kozunia83!';

  public constructor(private readonly connector: ComfortCloudConnector) {}

  public async connectToPanasonicCloud(): Promise<void> {
    return this.connector.login(this.userName, this.password);
  }

  public getHeatPumpDetails(): Promise<HeatPump> {
    return this.connector.getDeviceDetails();
  }
}
