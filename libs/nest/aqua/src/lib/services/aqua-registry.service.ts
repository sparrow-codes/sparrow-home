import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AquaPreferences, User, UserRole } from '@sparrow-server/entities';
import { TuyaApiService } from '@sparrow-server/external-api';
import { Commands } from '@sparrow-server/external-api';
import { CronJobName, TimeUtils } from '@sparrow-server/shared';
import { first } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class AquaRegistryService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _tuyaAPiService: TuyaApiService
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
      aquaPreferences.tuyaDevice
    ) {
      const timeInterval: number = TimeUtils.getTimeIntervalInSeconds(
        aquaPreferences.lightStartTime,
        aquaPreferences.lightEndTime
      );

      Logger.log(`Turning Aqua light on for ${timeInterval} seconds`);
      this._tuyaAPiService
        .sendCommands(aquaPreferences.tuyaDevice.tuyaDeviceId, this._prepareLightCommands(timeInterval))
        .pipe(first())
        .subscribe();
    }
  }

  private _prepareLightCommands(timeIntervalInSeconds: number): Commands<boolean | number>[] {
    return [
      {
        code: 'switch_1',
        value: true,
      },
      {
        code: 'countdown_1',
        value: timeIntervalInSeconds,
      },
    ];
  }
}
