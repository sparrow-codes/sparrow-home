import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CloudModule } from '../cloud/cloud.module';
import { CoreTaskService } from './services/core-task.service';

@Module({
  imports: [ScheduleModule.forRoot(), CloudModule],
  providers: [CoreTaskService],
})
export class TaskModule {}
