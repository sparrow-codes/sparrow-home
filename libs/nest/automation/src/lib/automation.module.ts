import { Module } from '@nestjs/common';
import { TaskService } from './services/task/task.service';
import { TaskController } from './controller/task/task.controller';
import { AuthModule } from '@sparrow-server/auth';
import { TaskCronFactory } from './services/test-cron-factory/task-cron-factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionJob, HomeDevice, Setup, Task } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';
import { TaskDtoMapperService } from './services/task-dto-mapper.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskCronFactory, TaskDtoMapperService],
  exports: [],
  imports: [AuthModule, TypeOrmModule.forFeature([Task, HomeDevice, ActionJob, Setup]), ApiModule],
})
export class AutomationModule {}
