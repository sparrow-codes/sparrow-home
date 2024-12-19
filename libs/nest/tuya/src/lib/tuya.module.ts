import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TuyaDevice } from './entities/tuyaDevice';
import { TuyaService } from './services/tuya.service';
import { TuyaDeviceController } from './controllers/tuya-device.controller';

@Module({
  controllers: [TuyaDeviceController],
  imports: [TypeOrmModule.forFeature([TuyaDevice])],
  providers: [TuyaService],
  exports: [],
})
export class TuyaModule {}
