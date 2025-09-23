import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { HomeDeviceController } from './controllers/home-device.controller';
import { HomeDeviceService } from './services/home-device/home-device.service';
import { PetFeederOperationsService } from './services/pet-feeder-operations/pet-feeder-operations.service';

@Module({
  controllers: [HomeDeviceController],
  imports: [TypeOrmModule.forFeature([HomeDevice, User]), AuthModule, ApiModule],
  providers: [HomeDeviceService, PetFeederOperationsService],
  exports: [],
})
export class HomeDeviceModule {}
