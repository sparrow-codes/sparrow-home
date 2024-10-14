import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';

import { CronJobName } from '../../../../enums/cron-job-name';
import { Mode } from '../../../../enums/mode';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { Setup } from '../../enitites/setup';
import { AUTUMN_JOBS, SUMMER_JOBS, WINTER_JOBS } from './mode-cron-jobs/mode-crone-jobs';

@Injectable()
export class ModeService {
  public constructor(
    @InjectRepository(Setup) private readonly setupRepository: Repository<Setup>,
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly cloudService: CloudConnectionService
  ) {}

  public async setMode(mode: Mode): Promise<void> {
    const setup: Setup = (await this.setupRepository.find())[0];
    if (setup.mode !== mode) {
      setup.mode = mode;
      await this.setupRepository.save(setup).then(() => {
        const jobs: string[] = Object.values(CronJobName);
        jobs.forEach((job) => {
          if (this.scheduleRegistry.doesExist('cron', job)) {
            const cronJob: CronJob = this.scheduleRegistry.getCronJob(job);
            cronJob.stop();
          }
        });

        switch (mode) {
          case Mode.AUTUMN:
            this._runJobsByList(AUTUMN_JOBS);
            break;
          case Mode.SUMMER:
            this._runJobsByList(SUMMER_JOBS);
            this.cloudService.setHeatOnly(false);
            break;
          case Mode.WINTER:
            this._runJobsByList(WINTER_JOBS);
            break;
          default:
            Logger.error(`Unsupported mode: ${mode}`);
        }
      });
    }
  }

  private _runJobsByList(jobNames: string[]): void {
    jobNames.forEach((jobName) => {
      const cronJob: CronJob = this.scheduleRegistry.getCronJob(jobName);
      cronJob.start();
    });
  }
}
