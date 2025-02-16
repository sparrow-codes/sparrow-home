import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

import { PanasonicService } from '../services';
import { CircularPumpService } from '../services/circular-pump/circular-pump.service';
import { HeatingPreferencesService } from '../services/heating-preferences/heating-preferences.service';
import { HeatPumpDetailsResponseMapper } from './mapper/heat-pump-details-response.mapper';
import { GetCircularPumpPreferences } from './models/circular-pump/get-circular-pump-preferences';
import { SetCircularPumpJobStatusRequest } from './models/circular-pump/set-circular-pump-job-status-request';
import { SetCircularPumpPreferencesRequest } from './models/circular-pump/set-circular-pump-preferences-request';
import { GetHeatingPreferencesResponse } from './models/heating-preferences/get-heating-preferences.response';
import { SetHeatingPreferencesRequest } from './models/heating-preferences/set-heating-preferences.request';
import { GetHeatPumpDetailsResponse } from './models/panasonic/get-heat-pump-details.response';
import { GetScheduledWaterHeatingStatusResponse } from './models/panasonic/get-scheduled-water-heating-status.response';
import { ScheduledWaterHeatingRequest } from './models/panasonic/scheduled-water-heating.request';
import { SetHeatPumpStatusRequest } from './models/panasonic/set-heat-pump-status.request';

@ApiTags('Panasonic Cloud')
@UseGuards(AuthGuard)
@Controller('panasonic-cloud')
@ApiBearerAuth()
export class CloudController {
  public constructor(
    private readonly _cloudService: PanasonicService,
    private readonly _circularPumpService: CircularPumpService,
    private readonly _heatingPreferences: HeatingPreferencesService
  ) {}

  @ApiOperation({ operationId: 'getHeatPumpDetails' })
  @ApiResponse({ type: GetHeatPumpDetailsResponse })
  @Get('/pump-heat-details')
  public getHeatPumpDetails(): Observable<GetHeatPumpDetailsResponse> {
    return this._cloudService.getHeatPumpDetails().pipe(map((heatPump) => HeatPumpDetailsResponseMapper.map(heatPump)));
  }

  @ApiOperation({ operationId: 'changeOperationStatus' })
  @Put('/change-operation-status')
  public async changeOperationStatus(@Body() request: SetHeatPumpStatusRequest): Promise<void> {
    await this._cloudService.setHeatPumpOperationMode(request);
  }

  @ApiOperation({ operationId: 'scheduledWaterHeating' })
  @Put('/scheduled-water-heating')
  public scheduledWaterHeating(@Req() request: Request<ScheduledWaterHeatingRequest>): Promise<void> {
    return this._cloudService.scheduledWaterHeating(request.body.active);
  }

  @ApiResponse({ type: GetScheduledWaterHeatingStatusResponse })
  @ApiOperation({ operationId: 'getScheduledWaterHeatingStatus' })
  @Get('/scheduled-water-heating-status')
  public getScheduledWaterHeatingStatus(): GetScheduledWaterHeatingStatusResponse {
    return { isScheduled: this._cloudService.isScheduledWaterHeating() };
  }

  @ApiOperation({ operationId: 'setCircularPumpPreferences' })
  @Put('/circular-pump/preferences')
  public setCircularPumpPreferences(@Body() request: SetCircularPumpPreferencesRequest): Promise<void> {
    return this._circularPumpService.setCircularPumpPreferences(request);
  }

  @ApiOperation({ operationId: 'setCircularPumpStatus' })
  @Put('/circular-pump/status')
  public setCircularPumpStatus(@Body() request: SetCircularPumpJobStatusRequest): Promise<void> {
    return this._circularPumpService.setCircularPumpScheduleTask(request.isActive);
  }

  @ApiOperation({ operationId: 'getCircularPumpPreferences' })
  @ApiResponse({ type: GetCircularPumpPreferences })
  @Get('/circular-pump/preferences')
  public getCircularPumpPreferences(): Promise<GetCircularPumpPreferences> {
    return this._circularPumpService.getCircularPumpPreferences();
  }

  @ApiOperation({ operationId: 'getHeatingPreferences' })
  @ApiResponse({ type: GetHeatingPreferencesResponse })
  @Get('/heating-preferences')
  public getHeatingPreferences(): Promise<GetHeatingPreferencesResponse> {
    return this._heatingPreferences.getHeatingPreferences();
  }

  @ApiOperation({ operationId: 'setHeatingPreferences' })
  @Put('/heating-preferences')
  public setHeatingPreferences(@Body() request: SetHeatingPreferencesRequest): Promise<void> {
    return this._heatingPreferences.setHeatingPreferences(request);
  }

  @ApiOperation({ operationId: 'setAutomaticHeating' })
  @Put('/heating-preferences/auto')
  public setAutomaticHeating(@Body() request: { isAutomaticHeating: boolean }): Promise<void> {
    return this._heatingPreferences.setAutomaticHeating(request.isAutomaticHeating);
  }
}
