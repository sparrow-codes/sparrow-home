import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { ActionJob, HomeDevice, Setup, Task } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { TaskController } from './controller/task/task.controller';
import { TaskService } from './services/task/task.service';
import { TaskDtoMapperService } from './services/task-dto-mapper.service';
import { TaskCronFactory } from './services/test-cron-factory/task-cron-factory.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskCronFactory, TaskDtoMapperService],
  exports: [],
  imports: [AuthModule, TypeOrmModule.forFeature([Task, HomeDevice, ActionJob, Setup]), ApiModule],
})
export class AutomationModule {}
