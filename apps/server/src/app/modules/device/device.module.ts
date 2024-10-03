import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { DeviceController } from './controllers/device.controller';
import { DeviceService } from './services/device/device.service';

@Module({
  providers: [DeviceService],
  imports: [AuthModule],
  controllers: [DeviceController],
})
export class DeviceModule {}
