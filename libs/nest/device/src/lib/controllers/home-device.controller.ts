import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { map, Observable } from 'rxjs';

import { HomeDeviceDto } from '../models/home-device-dto';
import { HomeDeviceService } from '../services/home-device.service';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';
import { SetPluginSwitchStatusRequest } from './models/set-plugin-switch-status.request';

@ApiBearerAuth()
@ApiTags('Home Device')
@UseGuards(AuthGuard)
@Controller('home-device')
export class HomeDeviceController {
  public constructor(private readonly _homeDeviceService: HomeDeviceService) {}

  @Get('all')
  @ApiResponse({ type: HomeDeviceDto, isArray: true })
  public async getAll(): Promise<HomeDeviceDto[]> {
    return this._homeDeviceService.getListOfDevices();
  }

  @ApiBody({ type: CreateDeviceRequest })
  @Post('create')
  public async createDevice(@Body() request: CreateDeviceRequest): Promise<void> {
    await this._homeDeviceService.addDevice(request.type, request.homeDeviceId, request.name);
  }

  @Delete('delete/:id')
  public async deleteDevice(@Param('id') id: string): Promise<void> {
    await this._homeDeviceService.removeDevice(Number(id));
  }

  @ApiResponse({ type: GetDeviceDetailsResponse })
  @Get('details/:id')
  public getDetails(@Param('id') id: string): Observable<GetDeviceDetailsResponse> {
    return this._homeDeviceService.getDeviceDetails(Number(id)).pipe(map((details) => ({ deviceDetails: details })));
  }

  @Post('switch/status/:id')
  public setPluginSwitchStatus(
    @Param('id') id: string,
    @Body() request: SetPluginSwitchStatusRequest
  ): Observable<boolean> {
    return this._homeDeviceService.setPluginSwitchStatus(Number(id), request.isOn);
  }

  @Get('paring-mode')
  public enableParingMode(): Observable<void> {
    return this._homeDeviceService.enableParingMode();
  }
}
