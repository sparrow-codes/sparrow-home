import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeSwitchMqttService } from '@sparrow-server/external-api';
import { CronJobName, TimeUtils } from '@sparrow-server/shared';
import { Repository } from 'typeorm';

@Injectable()
export class AquaRegistryService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _zigbeeSwitchMqttService: ZigbeeSwitchMqttService
  ) {}

  @Cron(new Date(), { disabled: true, name: CronJobName.EVERY_DAY_AQUA_LIGHT })
  public async setAquaLight(): Promise<void> {
    Logger.log('Starting scheduled task: Every day aqua light');
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    const aquaPreferences: AquaPreferences | undefined = user?.aquaPreferences;

    if (
      aquaPreferences &&
      aquaPreferences.lightStartTime &&
      aquaPreferences.lightEndTime &&
      aquaPreferences.homeDevice
    ) {
      const timeInterval: number = TimeUtils.getTimeIntervalInSeconds(
        aquaPreferences.lightStartTime,
        aquaPreferences.lightEndTime
      );
      const zigbeeDeviceId: string = aquaPreferences.homeDevice.zigbeeDeviceId;

      Logger.log(`Turning Aqua light on for ${timeInterval} seconds`);
      this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, true);

      setTimeout(() => {
        Logger.log('Switching off Aqua light');
        this._zigbeeSwitchMqttService.setSwitchOn(zigbeeDeviceId, false);
      }, timeInterval * 1000);
    } else {
      Logger.warn('Invalid Aqua light configuration');
    }
  }
}
