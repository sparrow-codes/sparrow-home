import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { CloudPreferences, TuyaDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { ComfortCloudConnector } from './connectors/comfort-cloud-connector';
import { CloudController } from './controllers/cloud.controller';
import { PanasonicService } from './services';
import { CircularPumpService } from './services/circular-pump/circular-pump.service';
import { CloudScheduleRegistryService } from './services/registry/cloud-schedule-registry.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, CloudPreferences, TuyaDevice]),
    ApiModule,
  ],
  providers: [PanasonicService, ComfortCloudConnector, CloudScheduleRegistryService, CircularPumpService],
  controllers: [CloudController],
  exports: [PanasonicService],
})
export class CloudModule {}
