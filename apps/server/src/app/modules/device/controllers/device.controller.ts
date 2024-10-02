import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { DeviceService } from '../services/device/device.service';

@UseGuards(AuthGuard)
@Controller('device')
export class DeviceController {
  public constructor(private readonly deviceService: DeviceService) {}

  @Get('/all')
  public getAllDevices(): void {
    this.deviceService.getDeviceListFromWifi();
  }
}
