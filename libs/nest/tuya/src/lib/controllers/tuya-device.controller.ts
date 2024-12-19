import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

import { TuyaDeviceDTO } from '../models/TuyaDeviceDTO';
import { TuyaService } from '../services/tuya.service';
import { CreateDeviceRequest } from './models/create-device-request';

@Controller('tuya-device')
export class TuyaDeviceController {
  public constructor(private readonly _tuyaService: TuyaService) {}

  @Get('all')
  @ApiResponse({ type: [TuyaDeviceDTO] })
  public async getAll(): Promise<TuyaDeviceDTO[]> {
    return this._tuyaService.getListOfDevices();
  }

  @ApiBody({ type: CreateDeviceRequest })
  @Post('create')
  public async createDevice(@Body() request: CreateDeviceRequest): Promise<void> {
    await this._tuyaService.addDevice(request.type, request.tuyaDeviceId, request.name);
  }

  @ApiParam({ name: 'id' })
  @Delete('delete/:id')
  public async deleteDevice(@Param('id') id: string): Promise<void> {
    await this._tuyaService.removeDevice(Number(id));
  }
}
