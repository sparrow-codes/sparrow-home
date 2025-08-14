import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { HomeDevice, Task } from '@sparrow-server/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskRequest } from '../../controller/task/model/create-task-request';
import { UpdateTaskRequest } from '../../controller/task/model/update-task-request';
import { TaskCronFactory } from '../test-cron-factory/test-cron-factory.service';

@Injectable()
export class TaskService {
  public constructor(
    @InjectRepository(Task) private readonly _taskRepository: Repository<Task>,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>,
    private readonly _taskCronFactory: TaskCronFactory
  ) {
    this._onInit();
  }

  public async getTaskList(): Promise<Task[]> {
    return this._taskRepository.find();
  }

  public async createTask(request: CreateTaskRequest): Promise<void> {
    const task: Task = new Task();
    task.isActive = false;
    task.name = request.name;
    task.startTime = request.from;
    task.endTime = request.to;

    task.homeDevices = await this._homeDeviceRepository.findBy({ id: In(request.assignedDevices) });

    await this._taskRepository.save(task);
  }

  public async updateTask(id: number, request: UpdateTaskRequest): Promise<void> {
    const task: Task | null = await this._taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.name = request.name;
    task.startTime = request.from;
    task.endTime = request.to;
    task.homeDevices = await this._homeDeviceRepository.findBy({ id: In(request.assignedDevices) });

    await this._taskRepository.save(task);

    if (task.isActive) {
      this._taskCronFactory.scheduleTask(task);
    }
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
      } catch {
        Logger.error('Failed to activate task', `[Task] ${task.name}`);
      }
    } else {
      task.isActive = false;
      await this._taskRepository.save(task);

      this.stopCronTask(task.id);
    }
  }

  private async _onInit(): Promise<void> {
    const tasks: Task[] = await this._taskRepository.find();
    for (const task of tasks) {
      if (task.isActive) {
        try {
          await this.activateTask(task);
        } catch {
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

  public stopCronTask(id: number) {
    this._taskCronFactory.clearScheduledTask(id);
  }
}
