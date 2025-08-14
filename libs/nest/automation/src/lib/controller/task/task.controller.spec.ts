import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../../services/task/task.service';
import { CreateTaskRequest } from './model/create-task-request';
import { UpdateTaskRequest } from './model/update-task-request';
import { AuthGuard } from '@sparrow-server/auth';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    getTaskList: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should call createTask on service with correct data', async () => {
    const dto: CreateTaskRequest = { name: 'Test Task', isActive: true } as any;
    await controller.createTask(dto);
    expect(service.createTask).toHaveBeenCalledWith(dto);
  });

  it('should call updateTask on service with correct id and data', async () => {
    const dto: UpdateTaskRequest = { name: 'Updated Task', isActive: false } as any;
    await controller.updateTask(dto, '1');
    expect(service.updateTask).toHaveBeenCalledWith(1, dto);
  });

  it('should call deleteTask on service with correct id', async () => {
    await controller.deleteTask(2);
    expect(service.deleteTask).toHaveBeenCalledWith(2);
  });

  it('should call updateTaskStatus on service with correct id and status', async () => {
    await controller.setTaskStatus(3, true);
    expect(service.updateTaskStatus).toHaveBeenCalledWith(3, true);
  });

  it('should call getTaskList on service', async () => {
    await controller.getTaskList();
    expect(service.getTaskList).toHaveBeenCalledTimes(1);
  });
});
