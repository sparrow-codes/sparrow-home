import { Controller, Get } from '@nestjs/common';
import { DeviceService } from '../services/device/device.service';

@Controller('device')
export class DeviceController {
    public constructor(private readonly deviceService: DeviceService) {}

    @Get('/all')
    public getAllDevices(): void {
        this.deviceService.getDeviceListFromWifi();
    }
}
