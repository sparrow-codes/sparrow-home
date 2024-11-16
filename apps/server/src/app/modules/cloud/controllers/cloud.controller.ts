import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

import { getUserId } from '../../../utils/request-util';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CloudConnectionService } from '../services/cloud-connection/cloud-connection.service';
import { HeatPumpDetailsResponseMapper } from './mapper/heat-pump-details-response.mapper';
import { GetHeatPumpDetailsResponse } from './models/get-heat-pump-details.response';
import { GetScheduledWaterHeatingStatusResponse } from './models/get-scheduled-water-heating-status.response';
import { ScheduledWaterHeatingRequest } from './models/scheduled-water-heating.request';
import { SetHeatPumpStatusRequest } from './models/set-heat-pump-status.request';

@UseGuards(AuthGuard)
@Controller('panasonic-cloud')
export class CloudController {
  public constructor(private readonly _cloudService: CloudConnectionService) {}

  @Get('/pump-heat-details')
  public getInsideTemperature(): Observable<GetHeatPumpDetailsResponse> {
    return this._cloudService.getHeatPumpDetails().pipe(map((heatPump) => HeatPumpDetailsResponseMapper.map(heatPump)));
  }

  @Put('/change-operation-status')
  public async changeOperationStatus(@Body() request: SetHeatPumpStatusRequest): Promise<void> {
    await this._cloudService.setHeatPumpOperationMode(request);
  }

  @Put('/scheduled-water-heating')
  public scheduledWaterHeating(@Req() request: Request<ScheduledWaterHeatingRequest>): Promise<void> {
    const userId: number = getUserId(request);
    return this._cloudService.scheduledWaterHeating(request.body.active, userId);
  }

  @Get('/scheduled-water-heating-status')
  public getScheduledWaterHeatingStatus(): GetScheduledWaterHeatingStatusResponse {
    return { isScheduled: this._cloudService.isScheduledWaterHeating() };
  }

  @Put('/long-bath')
  public setLongerBath(@Body() request: {isOn: boolean}): Promise<void> {
    return this._cloudService.setLongerBath(request.isOn);
  }

  @Put('/heat-over-night')
  public setHeatOverNight(@Body() request: {isOn: boolean}): Promise<void> {
    return this._cloudService.heatOverNight(request.isOn);
  }
}
