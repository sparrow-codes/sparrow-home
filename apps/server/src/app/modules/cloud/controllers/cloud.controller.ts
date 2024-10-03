import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { CloudConnectionService } from '../services/cloud-connection/cloud-connection.service';
import { HeatPump } from './models/panasonic-cloud-models';

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
