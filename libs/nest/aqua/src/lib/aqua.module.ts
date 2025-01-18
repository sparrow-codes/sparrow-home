import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { AquaPreferences, HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { AquaController } from './controllers/aqua.controller';
import { AquaService } from './services/aqua.service';
import { AquaRegistryService } from './services/aqua-registry.service';

@Module({
  controllers: [AquaController],
  imports: [
    TypeOrmModule.forFeature([User, HomeDevice, AquaPreferences]),
    ScheduleModule.forRoot(),
    AuthModule,
    ApiModule,
  ],
  providers: [AquaService, AquaRegistryService],
  exports: [],
})
export class AquaModule {}
