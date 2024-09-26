import { Controller, Get } from '@nestjs/common';
import { CloudConnectionService } from '../services/cloud-connection/cloud-connection.service';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

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
