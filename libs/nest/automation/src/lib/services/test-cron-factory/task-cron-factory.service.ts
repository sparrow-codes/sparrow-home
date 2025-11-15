import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { getEverydayCronTime } from '@sparrow-server/shared';
import { Task } from '@sparrow-server/entities';
import { ZigbeeDeviceService } from '@sparrow-server/external-api';

@Injectable()
export class TaskCronFactory {
  private readonly logger: Logger = new Logger(TaskCronFactory.name);

  private static readonly _JOB_PREFIX: string = 'JOB_';

  public constructor(
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _zigbeeDeviceService: ZigbeeDeviceService
  ) {}

  public scheduleTask(task: Task): void {
    if (task.actionJobs && task.actionJobs?.length !== 0) {
      for (const actionJob of task.actionJobs) {
        const jobId: string = this._getJobId(actionJob.id);

        if (this._schedulerRegistry.doesExist('cron', jobId)) {
          this.clearScheduledTask(actionJob.id);
        }

        const nextJobTime = new CronJob(getEverydayCronTime(actionJob.executionTime), () => {
          this.logger.log(`Starting job ${jobId}`);
          this._zigbeeDeviceService.publishEvent(actionJob.assignedDeviceId, actionJob.payload);
        });

        this._schedulerRegistry.addCronJob(jobId, nextJobTime);
        this.logger.log(`Next execution of job ${jobId} will be at ${nextJobTime.nextDate()}`);
        nextJobTime.start();
      }

      this.logger.log(`Scheduled cron jobs for task ${task.id}`);
    }
  }

  public clearScheduledTask(actionJobId: number): void {
    const jobId: string = this._getJobId(actionJobId);

    if (this._schedulerRegistry.doesExist('cron', jobId)) {
      this._schedulerRegistry.deleteCronJob(jobId);
    }

    this.logger.log(`Cleared scheduled job ${actionJobId}`);
  }

  private _getJobId(id: number): string {
    return `${TaskCronFactory._JOB_PREFIX}${id}`;
  }
}
