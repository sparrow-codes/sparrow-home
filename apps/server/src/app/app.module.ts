import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CloudModule } from './modules/cloud/cloud.module';
import { DeviceModule } from './modules/device/device.module';

@Module({
  imports: [CloudModule, HttpModule, DeviceModule],
})
export class AppModule {}
