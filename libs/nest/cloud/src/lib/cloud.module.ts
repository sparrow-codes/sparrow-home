import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { CloudPreferences, HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { CloudController } from './controllers/cloud.controller';
import { PanasonicService } from './services';
import { CircularPumpService } from './services/circular-pump/circular-pump.service';
import { CloudScheduleRegistryService } from './services/registry/cloud-schedule-registry.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    TypeOrmModule.forFeature([User, CloudPreferences, HomeDevice]),
    ApiModule,
  ],
  providers: [PanasonicService, CloudScheduleRegistryService, CircularPumpService],
  controllers: [CloudController],
})
export class CloudModule {}
