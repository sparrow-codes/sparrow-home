import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { User } from '../../../../entities/user';
import { CronJobName } from '../../../../enums/cron-job-name';
import { Mode } from '../../../../enums/mode';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { UserService } from '../../../user/services/user.service';
import { ModeDictionary } from '../../dictionaries/mode-dictionary';
import { SPRING_AUTUMN_JOBS, SUMMER_JOBS, WINTER_JOBS } from './mode-cron-jobs/mode-crone-jobs';

@Injectable()
export class ModeService {
  public constructor(
    private readonly _scheduleRegistry: SchedulerRegistry,
    private readonly _cloudService: CloudConnectionService,
    private readonly _userService: UserService
  ) {}

  public async setMode(mode: Mode, userId: number, force?: boolean): Promise<void> {
    const user: User = await this._userService.getUserById(userId);
    if (user.setup.mode !== mode || force) {
      user.setup.mode = mode;
      await this._userService.save(user).then(() => {
        const jobs: CronJobName[] = Object.values(CronJobName);
        jobs.forEach((job) => {
          if (this._scheduleRegistry.doesExist('cron', job)) {
            const cronJob: CronJob = this._scheduleRegistry.getCronJob(job);
            cronJob.stop();
          }
        });
        this.handleMode(mode);
      });
    }
  }

  public handleMode(mode: Mode): void {
    switch (mode) {
      case Mode.AUTUMN_SPRING:
        this._runJobsByList(SPRING_AUTUMN_JOBS);
        Logger.log(`Setting mode: ${ModeDictionary.find((value) => value.value === Mode.AUTUMN_SPRING)?.label}`);
        break;
      case Mode.SUMMER:
        this._runJobsByList(SUMMER_JOBS);
        this._cloudService.setHeatOnly(false);
        Logger.log(`Setting mode: ${ModeDictionary.find((value) => value.value === Mode.SUMMER)?.label}`);
        break;
      case Mode.WINTER:
        this._runJobsByList(WINTER_JOBS);
        Logger.log(`Setting mode: ${ModeDictionary.find((value) => value.value === Mode.WINTER)?.label}`);
        break;
      default:
        Logger.error(`Unsupported mode: ${mode}`);
    }
  }

  private _runJobsByList(jobNames: CronJobName[]): void {
    jobNames.forEach((jobName) => {
      const cronJob: CronJob = this._scheduleRegistry.getCronJob(jobName as CronJobName);
      cronJob.start();
    });
  }
}
