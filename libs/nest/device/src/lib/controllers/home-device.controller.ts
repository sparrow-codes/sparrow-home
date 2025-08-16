import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { map, Observable } from 'rxjs';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { OpenDoorSensorDetailsDto } from '../models/open-door-sensor-details-dto';
import { PilotDetailsDto } from '../models/pilot-details.dto';
import { PluginSwitchDetailsDto } from '../models/plugin-switch-details.dto';
import { SirenDetailsDto } from '../models/siren-details-dto';
import { TemperatureSensorDetailsDto } from '../models/temperature-sensor-details-dto';
import { HomeDeviceService } from '../services/home-device.service';
import { ChangeDeviceNameRequest } from './models/change-device-name.request';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetAllDeviceFilters } from './models/get-all-device-filters';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';
import { GetHomeAvgTemperature } from './models/get-home-avg-temperature';
import { SetPluginSwitchStatusRequest } from './models/set-plugin-switch-status.request';

@ApiBearerAuth()
@ApiTags('Home Device')
@UseGuards(AuthGuard)
@Controller('home-device')
export class HomeDeviceController {
  public constructor(private readonly _homeDeviceService: HomeDeviceService) {}

  @ApiOperation({ operationId: 'getAllDevices' })
  @ApiResponse({ type: HomeDeviceDetailsDto, isArray: true })
  @Post('all')
  public getAllDevices(@Body() filters?: GetAllDeviceFilters): Observable<HomeDeviceDetailsDto[]> {
    return this._homeDeviceService.getListOfDevices(filters);
  }

  @ApiOperation({ operationId: 'createDevice' })
  @ApiBody({ type: CreateDeviceRequest })
  @Post('create')
  public createDevice(@Body() request: CreateDeviceRequest): Observable<boolean> {
    return this._homeDeviceService.addDevice(request.type, request.name);
  }

  @ApiOperation({ operationId: 'updateDeviceName' })
  @ApiBody({ type: ChangeDeviceNameRequest })
  @Put('updateDeviceName')
  public async updateDeviceName(@Body() request: ChangeDeviceNameRequest): Promise<void> {
    await this._homeDeviceService.changeDeviceName(request.id, request.deviceName);
  }

  @ApiOperation({ operationId: 'deleteDevice' })
  @Delete('delete/:id')
  public async deleteDevice(@Param('id') id: string): Promise<void> {
    await this._homeDeviceService.removeDevice(Number(id));
  }

  @ApiOperation({ operationId: 'getDeviceDetails' })
  @ApiResponse({ type: GetDeviceDetailsResponse })
  @ApiExtraModels(
    OpenDoorSensorDetailsDto,
    PluginSwitchDetailsDto,
    SirenDetailsDto,
    TemperatureSensorDetailsDto,
    PilotDetailsDto
  )
  @Get('details/:id')
  public getDeviceDetails(@Param('id') id: string): Observable<GetDeviceDetailsResponse> {
    return this._homeDeviceService.getDeviceDetails(Number(id)).pipe(map((details) => ({ deviceDetails: details })));
  }

  @ApiOperation({ operationId: 'setPluginSwitchStatus' })
  @ApiBody({ type: SetPluginSwitchStatusRequest })
  @Post('switch/status/:id')
  public setPluginSwitchStatus(
    @Param('id') id: string,
    @Body() request: SetPluginSwitchStatusRequest
  ): Observable<boolean> {
    return this._homeDeviceService.setPluginSwitchStatus(Number(id), request.isOn);
  }

  @ApiOperation({ operationId: 'getHomeAvgTemperature' })
  @ApiResponse({ type: GetHomeAvgTemperature })
  @Get('avg-temperature')
  public async getHomeAvgTemperature(): Promise<GetHomeAvgTemperature> {
    return {
      avgTemperature: await this._homeDeviceService.getAvgTemperature(),
    };
  }

  @ApiOperation({ operationId: 'areAllDoorsAndWindowsClosed' })
  @ApiResponse({ type: Boolean })
  @Get('are-all-doors-and-windows-closed')
  public async areAllDoorsAndWindowsClosed(): Promise<boolean | null> {
    return this._homeDeviceService.areAllDoorsAndWindowsClosed();
  }
}
