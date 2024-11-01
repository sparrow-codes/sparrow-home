import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CloudModule } from '../cloud/cloud.module';
import { UserModule } from '../user/user.module';
import { WeatherModule } from '../waether/weather.module';
import { CoreTaskService } from './services/core-task.service';

@Module({
  imports: [ScheduleModule.forRoot(), CloudModule, WeatherModule, UserModule],
  providers: [CoreTaskService],
})
export class TaskModule {}
