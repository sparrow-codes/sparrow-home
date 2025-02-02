import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { ZigbeeSirenService } from '@sparrow-server/external-api';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmService {
  public constructor(
    private readonly _zigbeeSirenService: ZigbeeSirenService,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {}

  public async setAlarm(isOn: boolean): Promise<void> {
    const sirens: HomeDevice[] = await this._homeDeviceRepository.findBy({ deviceType: DeviceType.SIREN });

    if (sirens.length < 1) {
      Logger.log('No sirens found connected to your home!');
      return;
    }

    sirens.forEach((siren) => {
      this._zigbeeSirenService.setAlarm(siren.zigbeeDeviceId, isOn);
    });
  }
}
