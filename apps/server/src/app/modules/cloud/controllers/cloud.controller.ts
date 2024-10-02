import { Controller, Get, UseGuards } from '@nestjs/common';
import { HeatPump } from '@shared-models/panasonic-cloud-models';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { CloudConnectionService } from '../services/cloud-connection/cloud-connection.service';

@UseGuards(AuthGuard)
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
