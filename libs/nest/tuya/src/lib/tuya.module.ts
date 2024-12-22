import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../../../../../apps/server/src/app/modules/auth/auth.module';
import { TuyaDeviceController } from './controllers/tuya-device.controller';
import { TuyaDevice } from './entities/tuyaDevice';
import { TuyaService } from './services/tuya.service';

@Module({
  controllers: [TuyaDeviceController],
  imports: [TypeOrmModule.forFeature([TuyaDevice]), AuthModule],
  providers: [TuyaService],
  exports: [],
})
export class TuyaModule {}
