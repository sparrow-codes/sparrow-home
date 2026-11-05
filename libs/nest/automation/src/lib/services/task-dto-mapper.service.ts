import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionJob, HomeDevice, Task } from '@sparrow-server/entities';
import { DeviceProfile, ZigbeeDeviceService } from '@sparrow-server/external-api';
import { DeviceActionDto } from '@sparrow-server/shared';
import { Repository } from 'typeorm';

import { TaskActionDto } from '../controller/task/model/task-action-dto';
import { TaskDto } from '../controller/task/model/task-dto';
import { toTaskAction } from '../mappers/task-actions/to-task-action';
import { toTaskBasicDataDto } from '../mappers/task-basic-data/to-task-basic-data-dto';

@Injectable()
export class TaskDtoMapperService {
  public constructor(
    private readonly _zigbeeDeviceService: ZigbeeDeviceService,
    @InjectRepository(HomeDevice) public readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {}

  public async map(task: Task): Promise<TaskDto> {
    return {
      ...toTaskBasicDataDto(task),
      actions: task.actionJobs
        ? await Promise.all(task.actionJobs.map(async (action: ActionJob) => await this._toTaskAction(action)))
        : [],
    };
  }

  private async _toTaskAction(action: ActionJob): Promise<TaskActionDto> {
    const deviceProfile: DeviceProfile | undefined = this._zigbeeDeviceService.devices.get(action.assignedDeviceId);
    const homeDevice: HomeDevice | null = await this._homeDeviceRepository.findOneBy({
      zigbeeDeviceId: action.assignedDeviceId,
    });

    return {
      zigbeeDeviceId: action.assignedDeviceId,
      executionTime: action.executionTime,
      action: (deviceProfile && toTaskAction({ action, profile: deviceProfile })) as DeviceActionDto,
      deviceName: homeDevice?.deviceName ?? '',
      deviceDescription: deviceProfile?.deviceDefinition.description ?? '',
      daysOfTheWeek: action.daysOfWeek?.length ? action.daysOfWeek : null,
      runOnVacation: action.runOnVacation
    };
  }
}
