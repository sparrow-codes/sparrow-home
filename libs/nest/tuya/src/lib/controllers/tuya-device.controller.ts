import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { map, Observable } from 'rxjs';

import { TuyaDeviceDto } from '../models/tuya-device-dto';
import { TuyaService } from '../services/tuya.service';
import { CreateDeviceRequest } from './models/create-device-request';
import { GetDeviceDetailsResponse } from './models/get-device-details-response';

@ApiBearerAuth()
@ApiTags('Tuya Device')
@UseGuards(AuthGuard)
@Controller('tuya-device')
export class TuyaDeviceController {
  public constructor(private readonly _tuyaService: TuyaService) {}

  @Get('all')
  @ApiResponse({ type: TuyaDeviceDto, isArray: true })
  public async getAll(): Promise<TuyaDeviceDto[]> {
    return this._tuyaService.getListOfDevices();
  }

  @ApiBody({ type: CreateDeviceRequest })
  @Post('create')
  public async createDevice(@Body() request: CreateDeviceRequest): Promise<void> {
    await this._tuyaService.addDevice(request.type, request.tuyaDeviceId, request.name);
  }

  @Delete('delete/:id')
  public async deleteDevice(@Param('id') id: string): Promise<void> {
    await this._tuyaService.removeDevice(Number(id));
  }

  @ApiResponse({ type: GetDeviceDetailsResponse })
  @Get('details/:id')
  public getDetails(@Param('id') id: string): Observable<GetDeviceDetailsResponse> {
    return this._tuyaService.getDeviceDetails(Number(id)).pipe(map((details) => ({ deviceDetails: details })));
  }
}
