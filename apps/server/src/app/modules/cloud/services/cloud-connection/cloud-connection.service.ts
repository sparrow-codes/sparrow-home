import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { first, firstValueFrom, from, Observable, switchMap } from 'rxjs';

import { User } from '../../../../entities/user';
import { ConfigKey } from '../../../../enums/config-key';
import { CronJobName } from '../../../../enums/cron-job-name';
import { DateUtils } from '../../../../utils/date/date-utils';
import { WeatherApiService } from '../../../api/weather/weather-api.service';
import { UserRole } from '../../../user/enum/user-role';
import { UserService } from '../../../user/services/user.service';
import { ComfortCloudConnector } from '../../connectors/comfort-cloud-connector';
import { SetHeatPumpStatusRequest } from '../../controllers/models/set-heat-pump-status.request';
import { HeatPump } from '../../models/panasonic-cloud-models';

@Injectable()
export class CloudConnectionService {
  public constructor(
    private readonly _connector: ComfortCloudConnector,
    private readonly _configService: ConfigService,
    private readonly _scheduleRegistry: SchedulerRegistry,
    private readonly _userService: UserService,
    private readonly _weatherApiService: WeatherApiService
  ) {}

  public removeAuthToken(): void {
    this._connector.logout();
  }

  public async heatOverNight(isOn: boolean): Promise<void> {
    if(isOn) {
      const today: Date = new Date();
      const tomorrow: Date = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const user: User = await this._userService.getUserByRole(UserRole.OWNER);

      this._weatherApiService.getNextSunriseAndSunset(user.setup.lat, user.setup.lng, today, tomorrow)
        .pipe(first())
        .subscribe((data) => {
          const sunset: Date = data.sunset;
          const sunrise: Date = data.sunrise;
  
          const dateToStartHeating: Date = DateUtils.addHours(sunset, -2);
          const now: Date = new Date();
          const dateToTurnHeatOff: Date = DateUtils.addHours(sunrise, -2);
  
          if (dateToStartHeating > now && dateToTurnHeatOff > now) {
            Logger.log(`Setting up heat time at ${dateToStartHeating.toString()} for sunset at ${sunset.toString()}`);
  
            const startHeatingJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.HEAT_ON);
            startHeatingJob.setTime(new CronTime(dateToStartHeating));
            user.cloudPreferences.dateToStartHeating = dateToStartHeating;
          } else {
            this.setHeatOnly(true);
          }
  
          Logger.log(`Setting up heat off at ${dateToTurnHeatOff.toString()} for sunrise at ${sunrise.toString()}`);
  
          const stopHeatingJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.HEAT_OFF);
          stopHeatingJob.setTime(new CronTime(dateToTurnHeatOff));
          user.cloudPreferences.dateToTurnOffHeating = dateToTurnHeatOff;
          this._userService.save(user);
        });
    } else {
      const user: User = await this._userService.getUserByRole(UserRole.OWNER);
      this.setHeatOnly(false);
      
      user.cloudPreferences.dateToStartHeating = null;
      user.cloudPreferences.dateToTurnOffHeating = null;
      this._userService.save(user);
    }
  }

  public async setLongerBath(isOn: boolean): Promise<void> {
    const user: User = await this._userService.getUserByRole(UserRole.OWNER);

    if (isOn) {
      this.setWaterOnly(true);
      const turnWaterOff: Date = DateUtils.addHours(new Date(), 1);
      this._scheduleRegistry.getCronJob(CronJobName.WATER_OFF).setTime(new CronTime(turnWaterOff));
      const user: User = await this._userService.getUserByRole(UserRole.OWNER);
      user.cloudPreferences.dateToTurnWaterOff = turnWaterOff;
      await this._userService.save(user);
    } else {
      this.setWaterOnly(false);
      user.cloudPreferences.dateToTurnWaterOff = null;
      await this._userService.save(user);
    }
  }

  public getHeatPumpDetails(): Observable<HeatPump> {
    return from(this._connectToPanasonicCloud()).pipe(
      first(),
      switchMap(() => this._connector.getDeviceDetails())
    );
  }

  public async scheduledWaterHeating(active: boolean, userId: number): Promise<void> {
    const user: User = await this._userService.getUserById(userId);
    if (active) {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).start();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).start();
      user.cloudPreferences.isEverydayWaterHeatOn = true;
      Logger.log('Scheduling everyday water heating');
    } else {
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).stop();
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).stop();
      user.cloudPreferences.isEverydayWaterHeatOn = false;
      Logger.log('Setting off everyday water heating');
    }

    await this._userService.save(user);
  }

  public isScheduledWaterHeating(): boolean {
    return (
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_ON).running &&
      this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_WATER_OFF).running
    );
  }

  public async setHeatOnly(isHeatOn: boolean): Promise<void> {
    await this._connectToPanasonicCloud();
    const heatPump: HeatPump = await this._connector.getDeviceDetails();
    const isWaterOn: boolean = heatPump.tankStatus[0].operationStatus === 1;
    const isHeatCurrentlyOn: boolean = heatPump.zoneStatus[0].operationStatus === 1;
    if (isHeatCurrentlyOn !== isHeatOn) {
      await this.setHeatPumpOperationMode({ isWaterOn, isHeatOn, deviceGuid: heatPump.deviceGuid });
      Logger.log(`Setting heat: ${isHeatOn ? 'ON' : 'OFF'}`);
    } else {
      Logger.log('Heat status is already in desired state');
    }
  }

  public async setWaterOnly(isWaterOn: boolean): Promise<void> {
    await this._connectToPanasonicCloud();
    const heatPump: HeatPump = await this._connector.getDeviceDetails();
    const isWaterOnCurrently: boolean = heatPump.tankStatus[0].operationStatus === 1;
    const isHeatOn: boolean = heatPump.zoneStatus[0].operationStatus === 1;
    if (isWaterOnCurrently !== isWaterOn) {
      await this.setHeatPumpOperationMode({ isWaterOn, isHeatOn, deviceGuid: heatPump.deviceGuid });
      Logger.log(`Setting water: ${isWaterOn ? 'ON' : 'OFF'}`);
    } else {
      Logger.log('Water status is already in desired state');
    }
  }

  public async setHeatPumpOperationMode(request: SetHeatPumpStatusRequest): Promise<void> {
    await this._connectToPanasonicCloud();
    await firstValueFrom(this._connector.setDeviceStatus(request.isWaterOn, request.isHeatOn, request.deviceGuid));
  }

  private async _connectToPanasonicCloud(): Promise<void> {
    const userName: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_LOGIN);
    const password: string = this._configService.get(ConfigKey.PANASONIC_CLOUD_PASSWORD);

    if (!userName || !password) {
      throw new UnauthorizedException();
    }

    return this._connector.login(userName, password);
  }
}
