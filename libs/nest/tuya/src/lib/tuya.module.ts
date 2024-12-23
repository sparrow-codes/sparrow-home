import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { TuyaDevice } from '@sparrow-server/entities';

import { TuyaDeviceController } from './controllers/tuya-device.controller';
import { TuyaService } from './services/tuya.service';

@Module({
  controllers: [TuyaDeviceController],
  imports: [TypeOrmModule.forFeature([TuyaDevice]), AuthModule],
  providers: [TuyaService],
  exports: [],
})
export class TuyaModule {}
