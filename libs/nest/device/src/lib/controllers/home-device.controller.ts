import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { map, Observable } from 'rxjs';

import { HomeDeviceDetailsDto } from '../models/home-device-details-dto';
import { HomeDeviceService } from '../services/home-device/home-device.service';
import { ChangeDeviceNameRequest } from './models/change-device-name.request';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetAllDeviceFilters } from './models/get-all-device-filters';
import { GetAllDoorAndWindowsStatus } from './models/get-all-door-and-windows-status';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';
import { GetHomeAvgTemperature } from './models/get-home-avg-temperature';
import { PublishEventRequest } from './models/publish-event-request';
import { SetDeviceSettingsRequest } from './models/set-device-settings-request';

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
  @Get('details/:id')
  public getDeviceDetails(@Param('id') id: string): Observable<GetDeviceDetailsResponse> {
    return this._homeDeviceService.getDeviceDetails(Number(id)).pipe(map((details) => ({ deviceDetails: details })));
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
  @ApiResponse({ type: GetAllDoorAndWindowsStatus })
  @Get('are-all-doors-and-windows-closed')
  public async areAllDoorsAndWindowsClosed(): Promise<GetAllDoorAndWindowsStatus> {
    return {
      areAllDoorsAndWindowsClosed: await this._homeDeviceService.areAllDoorsAndWindowsClosed(),
    };
  }

  @ApiOperation({ operationId: 'publishZigbeeEvent' })
  @ApiBody({ type: PublishEventRequest })
  @Post('publish-zigbee-event')
  public publishZigbeeEvent(@Body() request: PublishEventRequest): void {
    return this._homeDeviceService.publishEvent(request.deviceId, request.payload);
  }

  @ApiOperation({ operationId: 'setDeviceSettings' })
  @ApiBody({ type: SetDeviceSettingsRequest })
  @Put('main-fields/:id')
  public async setDeviceSettings(@Param('id') id: string, @Body() request: SetDeviceSettingsRequest): Promise<void> {
    await this._homeDeviceService.setDeviceSettings(Number(id), request);
  }
}
