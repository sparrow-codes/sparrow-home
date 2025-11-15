import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { HomeDevice } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { HomeDeviceController } from './controllers/home-device.controller';
import { HomeDeviceService } from './services/home-device/home-device.service';

@Module({
  controllers: [HomeDeviceController],
  imports: [TypeOrmModule.forFeature([HomeDevice]), AuthModule, ApiModule],
  providers: [HomeDeviceService],
  exports: [],
})
export class HomeDeviceModule {}
