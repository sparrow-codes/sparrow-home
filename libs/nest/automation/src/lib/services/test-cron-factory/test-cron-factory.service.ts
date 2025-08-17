import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { getEverydayCronTime } from '@sparrow-server/shared';
import { HomeDevice, Task } from '@sparrow-server/entities';
import { ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { DeviceType } from '@sparrow-server/entities';

@Injectable()
export class TaskCronFactory {
  private static readonly _START_PREFIX: string = 'START_';
  private static readonly _END_PREFIX: string = 'END_';

  public constructor(
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _zigbeeService: ZigbeeSwitchMqttService
  ) {}

  public scheduleTask(task: Task): void {
    const startJobName = this._getTaskStartName(task.id);
    const endJobName = this._getTaskEndName(task.id);

    if (!task.homeDevices?.length) {
      Logger.warn(`Task ${task.id} has no devices`);
      return;
    }

    this.clearScheduledTask(task.id);

    if (task.startTime) {
      const startJob = new CronJob(getEverydayCronTime(task.startTime), () => {
        Logger.log(`Starting task ${task.id}`);
        task.homeDevices?.forEach((device) => this._activateDevice(device));
      });

      this._schedulerRegistry.addCronJob(startJobName, startJob);
      Logger.log(`Next execution of task ${task.id} will be at ${startJob.nextDate()}`);
      startJob.start();
    }

    if (task.endTime) {
      const endJob = new CronJob(getEverydayCronTime(task.endTime), () => {
        Logger.log(`Finishing task ${task.id}`);
        task.homeDevices?.forEach((device) => this._deactivateDevice(device));
      });

      this._schedulerRegistry.addCronJob(endJobName, endJob);
      Logger.log(`Task ${task.id} will finish at ${endJob.nextDate()}`);
      endJob.start();
    }

    Logger.log(`Scheduled cron for task ${task.id}`, '[TaskCronFactory]');
  }

  public clearScheduledTask(taskId: number): void {
    const startJobName = this._getTaskStartName(taskId);
    const endJobName = this._getTaskEndName(taskId);

    if (this._schedulerRegistry.doesExist('cron', startJobName)) {
      this._schedulerRegistry.deleteCronJob(startJobName);
    }

    if (this._schedulerRegistry.doesExist('cron', endJobName)) {
      this._schedulerRegistry.deleteCronJob(endJobName);
    }

    Logger.log(`Cleared scheduled task ${taskId}`, '[TaskCronFactory]');
  }

  private _activateDevice(device: HomeDevice) {
    switch (device.deviceType) {
      case DeviceType.POWER_PLUG:
        this._zigbeeService.setSwitchOn(device.zigbeeDeviceId, true);
        break;
      default:
        Logger.warn(`Unsupported device type: ${device.deviceType} (ID: ${device.id})`);
    }
  }

  private _deactivateDevice(device: HomeDevice) {
    switch (device.deviceType) {
      case DeviceType.POWER_PLUG:
        this._zigbeeService.setSwitchOn(device.zigbeeDeviceId, false);
        break;
      default:
        Logger.warn(`Unsupported device type: ${device.deviceType} (ID: ${device.id})`);
    }
  }

  private _getTaskStartName(id: number) {
    return `${TaskCronFactory._START_PREFIX}${id}`;
  }

  private _getTaskEndName(id: number) {
    return `${TaskCronFactory._END_PREFIX}${id}`;
  }
}
