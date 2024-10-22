import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { combineLatest, first, from } from 'rxjs';

import { Setup } from '../../../../entities/setup';
import { CronJobName } from '../../../../enums/cron-job-name';
import { DateUtils } from '../../../../utils/date/date-utils';
import { CloudConnectionService } from '../../../cloud/services/cloud-connection/cloud-connection.service';
import { UserRole } from '../../../user/enum/user-role';
import { UserService } from '../../../user/services/user.service';
import { WeatherService } from '../../../waether/services/weather.service';

@Injectable()
export class CloudTaskService {
  public constructor(
    private readonly _weatherService: WeatherService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _cloudService: CloudConnectionService,
    private readonly _userService: UserService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { name: CronJobName.TURN_HEAT_IF_COLD_NIGHT, disabled: true })
  public turnHeatIfColdNight(): void {
    Logger.log('Checking temperature over night');
    combineLatest([
      from(this._userService.getUserByRole(UserRole.OWNER)),
      this._weatherService.getSunriseAndSunsetWithLowestTemperature(),
    ])
      .pipe(first())
      .subscribe(([user, data]) => {
        const setup: Setup = user.setup;
        const sunset: Date = data.sunset;
        const sunrise: Date = data.sunrise;

        if (data.lowestTemperature <= setup.marginTemperatureOverNight) {
          const dateToStartHeating: Date = DateUtils.addHours(sunset, -2);
          Logger.log(`Setting up heat time at ${dateToStartHeating.toString()} for sunset at ${sunset.toString()}`);

          const dateToTurnHeatOff: Date = DateUtils.addHours(sunrise, -2);
          Logger.log(`Setting up heat time at ${dateToStartHeating.toString()} for sunset at ${sunset.toString()}`);

          const heatOnJob: CronJob = new CronJob(dateToStartHeating, () => this._cloudService.setHeatOnly(true));
          const heatOffJob: CronJob = new CronJob(dateToTurnHeatOff, () => this._cloudService.setHeatOnly(false));

          this._schedulerRegistry.addCronJob('heatOn', heatOnJob);
          this._schedulerRegistry.addCronJob('heatOff', heatOffJob);

          heatOnJob.start();
          heatOffJob.start();
        } else {
          Logger.log(`Temperature over night is planned to be: ${data.lowestTemperature}. Heat will not be turned on`);
        }
      });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, { disabled: true, name: CronJobName.EVERY_DAY_WATER_ON })
  public async everyDayWaterOn(): Promise<void> {
    Logger.log('Setting up water heating');
    await this._cloudService.setWaterOnly(true);
  }

  @Cron('0 30 14 * * 1-7', { disabled: true, name: CronJobName.EVERY_DAY_WATER_OFF })
  public async everyDayWaterOff(): Promise<void> {
    Logger.log('Setting down water heating');
    await this._cloudService.setWaterOnly(false);
  }
}
