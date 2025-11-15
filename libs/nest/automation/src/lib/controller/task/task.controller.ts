import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@sparrow-server/auth';
import { TaskService } from '../../services/task/task.service';
import { CreateTaskRequest } from './model/create-task-request';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskRequest } from './model/update-task-request';
import { TaskDto } from './model/task-dto';

@ApiTags('Tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  public constructor(private readonly _taskService: TaskService) {}

  @Post('create')
  @ApiOperation({ operationId: 'createTask' })
  public async createTask(@Body() request: CreateTaskRequest): Promise<void> {
    await this._taskService.createTask(request);
  }

  @Put('update/:id')
  @ApiOperation({ operationId: 'updateTask' })
  public async updateTask(@Body() request: UpdateTaskRequest, @Param('id') id: string): Promise<void> {
    await this._taskService.updateTask(Number(id), request);
  }

  @Delete('delete/:id')
  @ApiOperation({ operationId: 'deleteTask' })
  public async deleteTask(@Param('id') id: number): Promise<void> {
    await this._taskService.deleteTask(id);
  }

  @Get('update-status/:id')
  @ApiOperation({ operationId: 'setTaskStatus' })
  public async setTaskStatus(@Param('id') id: number, @Query('active') isActive: boolean): Promise<void> {
    await this._taskService.updateTaskStatus(id, isActive);
  }

  @Get('task-list')
  @ApiOperation({ operationId: 'getTaskList' })
  @ApiResponse({ type: TaskDto, isArray: true })
  public async getTaskList(): Promise<TaskDto[]> {
    return await this._taskService.getTaskList();
  }
}
