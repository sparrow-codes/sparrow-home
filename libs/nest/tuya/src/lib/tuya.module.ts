import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { TuyaDevice } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { TuyaDeviceController } from './controllers/tuya-device.controller';
import { TuyaService } from './services/tuya.service';

@Module({
  controllers: [TuyaDeviceController],
  imports: [TypeOrmModule.forFeature([TuyaDevice]), AuthModule, ApiModule],
  providers: [TuyaService],
  exports: [],
})
export class TuyaModule {}
