import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { User } from '@sparrow-server/entities';

import { ComfortCloudConnector } from './connectors/comfort-cloud-connector';
import { CloudController } from './controllers/cloud.controller';
import { CloudConnectionService } from './services';
import { CloudScheduleRegistryService } from './services/registry/cloud-schedule-registry.service';

@Module({
  imports: [HttpModule, AuthModule, ScheduleModule.forRoot(), TypeOrmModule.forFeature([User])],
  providers: [CloudConnectionService, ComfortCloudConnector, CloudScheduleRegistryService],
  controllers: [CloudController],
  exports: [CloudConnectionService],
})
export class CloudModule {}
