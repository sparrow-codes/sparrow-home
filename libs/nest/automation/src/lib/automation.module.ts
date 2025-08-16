import { Module } from '@nestjs/common';
import { TaskService } from './services/task/task.service';
import { TaskController } from './controller/task/task.controller';
import { AuthModule } from '@sparrow-server/auth';
import { TaskCronFactory } from './services/test-cron-factory/test-cron-factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeDevice, Task } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskCronFactory],
  exports: [],
  imports: [AuthModule, TypeOrmModule.forFeature([Task, HomeDevice]), ApiModule],
})
export class AutomationModule {}
