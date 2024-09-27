import { Controller, Get } from '@nestjs/common';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

import { CloudConnectionService } from '../services/cloud-connection/cloud-connection.service';

@Controller('panasonic-cloud')
export class CloudController {
  public constructor(private readonly cloudService: CloudConnectionService) {}

  @Get('/connect')
  public connect(): Promise<void> {
    return this.cloudService.connectToPanasonicCloud();
  }

  @Get('/pump-heat-details')
  public getInsideTemperature(): Promise<HeatPump> {
    return this.cloudService.getHeatPumpDetails();
  }
}
