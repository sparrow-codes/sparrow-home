import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { User } from '../../../entities/user';
import { CloudConnectionService } from '../../cloud/services/cloud-connection/cloud-connection.service';
import { UserService } from '../../user/services/user.service';

export interface HeatScheduleInput {
  date: Date;
  userId: number;
  cloudService: CloudConnectionService;
  userService: UserService;
  schedulerRegistry: SchedulerRegistry;
}

export function scheduleHeatOff(input: HeatScheduleInput): void {
  const heatOffJob: CronJob = new CronJob(input.date, async () => {
    await input.cloudService.setHeatOnly(false);
    const user: User = await input.userService.getUserById(input.userId);
    user.cloudPreferences.dateToTurnOffHeating = null;
    user.cloudPreferences.dateToStartHeating = null;
    await input.userService.save(user);
  });
  input.schedulerRegistry.addCronJob('heatOff', heatOffJob);
  heatOffJob.start();
}

export function scheduleHeatOn(input: HeatScheduleInput): void {
  const heatOnJob: CronJob = new CronJob(input.date, () => input.cloudService.setHeatOnly(true));
  input.schedulerRegistry.addCronJob('heatOn', heatOnJob);
  heatOnJob.start();
}
