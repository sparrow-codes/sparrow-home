import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActionJob, Task } from '@sparrow-server/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskRequest } from '../../controller/task/model/create-task-request';
import { UpdateTaskRequest } from '../../controller/task/model/update-task-request';
import { TaskCronFactory } from '../test-cron-factory/task-cron-factory.service';
import { TaskDto } from '../../controller/task/model/task-dto';
import { TaskDtoMapperService } from '../task-dto-mapper.service';

@Injectable()
export class TaskService implements OnModuleInit {
  public constructor(
    @InjectRepository(Task) private readonly _taskRepository: Repository<Task>,
    private readonly _taskCronFactory: TaskCronFactory,
    private readonly _taskDtoMapperService: TaskDtoMapperService
  ) {}

  public async onModuleInit(): Promise<void> {
    await this._onInit();
  }

  public async getTaskList(): Promise<TaskDto[]> {
    const tasks: Task[] = (await this._taskRepository.find()).sort((prev, curr) => (prev.id > curr.id ? 1 : -1));

    return Promise.all(tasks.map(async (task) => await this._taskDtoMapperService.map(task)));
  }

  public async createTask(request: CreateTaskRequest): Promise<void> {
    const task: Task = new Task();
    task.isActive = false;
    this.setTaskParams(task, request);

    await this._taskRepository.save(task);
  }

  public async updateTask(id: number, request: UpdateTaskRequest): Promise<void> {
    const task: Task | null = await this._taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.isActive) {
      for (const action of task.actionJobs) {
        this._taskCronFactory.clearScheduledTask(action.id);
      }
    }

    this.setTaskParams(task, request);
    await this._taskRepository.save(task);

    if (task.isActive) {
      this._taskCronFactory.scheduleTask(task);
    }
  }

  private setTaskParams(task: Task, request: UpdateTaskRequest): void {
    task.name = request.name;
    task.daysOfWeek = request.daysOfTheWeek ? request.daysOfTheWeek : null;
    task.actionJobs =
      request.actions?.map((actionDto) => {
        const entity: ActionJob = new ActionJob();
        entity.assignedDeviceId = actionDto.assignedDeviceId;
        entity.executionTime = new Date(actionDto.executionTime);
        entity.payload = actionDto.payload;
        entity.task = task;
        entity.daysOfWeek = actionDto.daysOfTheWeek ? actionDto.daysOfTheWeek : null;

        return entity;
      }) ?? [];
  }

  public async deleteTask(id: number): Promise<void> {
    this._taskCronFactory.clearScheduledTask(id);
    await this._taskRepository.delete({ id });
  }

  public async updateTaskStatus(id: number, isActive: boolean): Promise<void> {
    const task: Task | null = await this._taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (isActive) {
      try {
        await this.activateTask(task);
      } catch (error) {
        Logger.error(error);
        Logger.error('Failed to activate task', `[Task] ${task.name}`);
      }
    } else {
      task.isActive = false;
      await this._taskRepository.save(task);

      this.stopCronTask(task);
    }
  }

  private async _onInit(): Promise<void> {
    const tasks: Task[] = await this._taskRepository.find();
    for (const task of tasks) {
      if (task.isActive) {
        try {
          await this.activateTask(task);
        } catch (error) {
          Logger.error(error);
          Logger.error('Failed to activate task', `[Task] ${task.name}`);
        }
      }
    }
  }

  public async activateTask(task: Task): Promise<void> {
    this._taskCronFactory.scheduleTask(task);
    task.isActive = true;
    await this._taskRepository.save(task);
  }

  private stopCronTask(task: Task): void {
    for (const action of task.actionJobs) {
      this._taskCronFactory.clearScheduledTask(action.id);
    }
  }
}
