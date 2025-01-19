import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { AquaPreferences, CloudPreferences, HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { HomeDeviceController } from './controllers/home-device.controller';
import { HomeDeviceService } from './services/home-device.service';

@Module({
  controllers: [HomeDeviceController],
  imports: [TypeOrmModule.forFeature([HomeDevice, User, AquaPreferences, CloudPreferences]), AuthModule, ApiModule],
  providers: [HomeDeviceService],
  exports: [],
})
export class HomeDeviceModule {}
