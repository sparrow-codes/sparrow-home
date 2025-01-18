import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, User, UserRole } from '@sparrow-server/entities';
import { ZigbeeMqttService } from '@sparrow-server/external-api';
import { CronJobName, TimeUtils } from '@sparrow-server/shared';
import { Repository } from 'typeorm';

@Injectable()
export class AquaRegistryService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly zigbeeMqttService: ZigbeeMqttService
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

      this.zigbeeMqttService.setSwitchOn(aquaPreferences.homeDevice.zigbeeDeviceId, true, timeInterval);
      Logger.log(`Turning Aqua light on for ${timeInterval} seconds`);
    }
  }
}
