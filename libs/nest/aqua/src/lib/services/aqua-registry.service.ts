import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { CronJobName } from '@sparrow-server/shared';
import { CronJob } from 'cron/dist/job';
import { Repository } from 'typeorm';

@Injectable()
export class AquaRegistryService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {}

  @Cron(new Date(), { disabled: true, name: CronJobName.EVERY_DAY_AQUA_LIGHT })
  public async turnOnAquaLight(): Promise<void> {
    Logger.log('Starting scheduled task: Every day aqua light on');
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    const aquaPreferences: AquaPreferences | undefined = user?.aquaPreferences;

    if (aquaPreferences && aquaPreferences.homeDevice) {
      const zigbeeDeviceId: string = aquaPreferences.homeDevice.zigbeeDeviceId;
      this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, true);
    } else {
      Logger.warn('Invalid Aqua light configuration');
    }
  }

  @Cron(new Date(), { disabled: true, name: CronJobName.EVERY_DAY_AQUA_LIGHT_OFF })
  public async turnOffAquaLight(): Promise<void> {
    Logger.log('Starting scheduled task: Every day aqua light off');
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    const aquaPreferences: AquaPreferences | undefined = user?.aquaPreferences;

    if (aquaPreferences && aquaPreferences.homeDevice) {
      const zigbeeDeviceId: string = aquaPreferences.homeDevice.zigbeeDeviceId;
      this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, false);

      const nextStartJob: CronJob = this._scheduleRegistry.getCronJob(CronJobName.EVERY_DAY_AQUA_LIGHT);
      Logger.log(`Next aqua light will run at ${nextStartJob.nextDate()}`);

    } else {
      Logger.warn('Invalid Aqua light configuration');
    }
  }
}
