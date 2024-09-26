import { Module } from '@nestjs/common';
import { DeviceService } from './services/device/device.service';
import { DeviceController } from './controllers/device.controller';

@Module({
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
