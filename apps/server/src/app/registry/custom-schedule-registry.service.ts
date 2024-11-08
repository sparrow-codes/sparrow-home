import { Injectable, Logger } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { combineLatest, first, from } from 'rxjs';

import { Setup } from '../entities/setup';
import { User } from '../entities/user';
import { CronJobName } from '../enums/cron-job-name';
import { CloudConnectionService } from '../modules/cloud/services/cloud-connection/cloud-connection.service';
import { UserRole } from '../modules/user/enum/user-role';
import { UserService } from '../modules/user/services/user.service';
import { WeatherService } from '../modules/waether/services/weather.service';
import { DateUtils } from '../utils/date/date-utils';

@Injectable()
export class CustomScheduleRegistryService {
  public constructor(
    private readonly _cloudService: CloudConnectionService,
    private readonly _userService: UserService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _weatherService: WeatherService
  ) {}

  public getCronJob(jobName: CronJobName): CronJob {
    const cronJob: CronJob = this._schedulerRegistry.getCronJob(jobName);
    if (!cronJob) {
      throw new RuntimeException('Missing cronJob in registry!');
    }

    return cronJob;
  }

  public doesExist(type: 'cron', jobName: CronJobName): boolean {
    return this._schedulerRegistry.doesExist(type, jobName);
  }

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
          Logger.log(`Setting up heat time at ${dateToTurnHeatOff.toString()} for sunrise at ${sunrise.toString()}`);

          const startHeatingJob: CronJob = this.getCronJob(CronJobName.HEAT_ON);
          startHeatingJob.setTime(new CronTime(dateToStartHeating));

          const stopHeatingJob: CronJob = this.getCronJob(CronJobName.HEAT_OFF);
          stopHeatingJob.setTime(new CronTime(dateToTurnHeatOff));

          user.cloudPreferences.dateToStartHeating = dateToStartHeating;
          user.cloudPreferences.dateToTurnOffHeating = dateToTurnHeatOff;
          this._userService.save(user);
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

  @Cron(new Date(), { disabled: true, name: CronJobName.HEAT_ON })
  public async setHeatOn(): Promise<void> {
    Logger.log('Setting up heating');
    await this._cloudService.setHeatOnly(true);
  }

  @Cron(new Date(), { disabled: true, name: CronJobName.HEAT_OFF })
  public async setHeatOff(): Promise<void> {
    Logger.log('Setting down heating');
    await this._cloudService.setHeatOnly(false);
    const user: User = await this._userService.getUserByRole(UserRole.OWNER);
    user.cloudPreferences.dateToTurnOffHeating = null;
    user.cloudPreferences.dateToStartHeating = null;
    await this._userService.save(user);
  }

  @Cron(new Date, {disabled: true, name: CronJobName.WATER_OFF})
  public async setWaterOff(): Promise<void> {
    Logger.log('Turning water off');
    await this._cloudService.setWaterOnly(false);
    const user: User = await this._userService.getUserByRole(UserRole.OWNER);
    user.cloudPreferences.dateToTurnWaterOff = null;
    await this._userService.save(user);
  }
}
