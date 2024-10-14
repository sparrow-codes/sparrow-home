import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudModule } from '../cloud/cloud.module';
import { Setup } from '../setup/enitites/setup';
import { WeatherModule } from '../waether/weather.module';
import { CloudTaskService } from './services/cloud/cloud-task.service';
import { CoreTaskService } from './services/core-task.service';

@Module({
  imports: [ScheduleModule.forRoot(), CloudModule, WeatherModule, TypeOrmModule.forFeature([Setup])],
  providers: [CoreTaskService, CloudTaskService],
})
export class TaskModule {}
