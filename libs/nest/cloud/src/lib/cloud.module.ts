import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { CloudPreferences, HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { CloudController } from './controllers/cloud.controller';
import { PanasonicService } from './services';
import { HeatingPreferencesService } from './services/heating-preferences/heating-preferences.service';
import { CloudScheduleRegistryService } from './services/registry/cloud-schedule-registry.service';

@Module({
  imports: [HttpModule, AuthModule, TypeOrmModule.forFeature([User, CloudPreferences, HomeDevice]), ApiModule],
  providers: [PanasonicService, CloudScheduleRegistryService, HeatingPreferencesService],
  controllers: [CloudController],
})
export class CloudModule {}
