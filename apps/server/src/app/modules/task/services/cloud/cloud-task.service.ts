import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { combineLatest, first, from } from 'rxjs';
import { Repository } from 'typeorm';

import { CronJobName } from '../../../../enums/cron-job-name';
import { DateUtils } from '../../../../utils/date-utils';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { Setup } from '../../../setup/enitites/setup';
import { WeatherService } from '../../../waether/services/weather.service';

@Injectable()
export class CloudTaskService {
  public constructor(
    private readonly weatherService: WeatherService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly cloudService: CloudConnectionService,
    @InjectRepository(Setup) private readonly setupRepository: Repository<Setup>
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { name: CronJobName.TURN_HEAT_IF_COLD_NIGHT, disabled: true })
  public turnHeatIfColdNight(): void {
    Logger.log('Checking temperature over night');
    combineLatest([from(this.setupRepository.find()), this.weatherService.getSunriseAndSunsetWithLowestTemperature()])
      .pipe(first())
      .subscribe(([setups, data]) => {
        const setup: Setup = setups[0];
        const sunset: Date = data.sunset;
        const sunrise: Date = data.sunrise;

        if (data.lowestTemperature <= setup.marginTemperatureOverNight) {
          const dateToStartHeating: Date = DateUtils.addHours(sunset, -2);
          Logger.log(`Setting up heat time at ${dateToStartHeating.toString()} for sunset at ${sunset.toString()}`);

          const dateToTurnHeatOff: Date = DateUtils.addHours(sunrise, -2);
          Logger.log(`Setting up heat time at ${dateToStartHeating.toString()} for sunset at ${sunset.toString()}`);

          const heatOnJob: CronJob = new CronJob(dateToStartHeating, () => this.cloudService.setHeatOnly(true));
          const heatOffJob: CronJob = new CronJob(dateToTurnHeatOff, () => this.cloudService.setHeatOnly(false));

          this.schedulerRegistry.addCronJob('heatOn', heatOnJob);
          this.schedulerRegistry.addCronJob('heatOff', heatOffJob);

          heatOnJob.start();
          heatOffJob.start();
        } else {
          Logger.log(`Temperature over night is planned to be: ${data.lowestTemperature}. Heat will not be turned on`);
        }
      });
  }
}
