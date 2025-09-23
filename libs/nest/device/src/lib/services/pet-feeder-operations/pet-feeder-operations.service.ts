import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { ZigbeePetFeederService } from '@sparrow-server/external-api';
import { Repository } from 'typeorm';

import { SetPetFeederConfig } from '../../controllers/models/set-pet-feeder-config';

@Injectable()
export class PetFeederOperationsService {
  public constructor(
    private readonly _zigbeePetFeederService: ZigbeePetFeederService,
    @InjectRepository(HomeDevice) private readonly _homeDeviceRepository: Repository<HomeDevice>
  ) {}

  public async feedPet(deviceId: number): Promise<void> {
    const petFeeder: HomeDevice | null = await this._getPetFeederDevice(deviceId);

    this._zigbeePetFeederService.feedPet(petFeeder.zigbeeDeviceId);
  }

  public async setPetFeederOptions(deviceId: number, request: SetPetFeederConfig): Promise<void> {
    const petFeeder: HomeDevice | null = await this._getPetFeederDevice(deviceId);

    this._zigbeePetFeederService.setPetFeederConfiguration(
      petFeeder.zigbeeDeviceId,
      request.numberOfPortions,
      request.portionSize
    );

    petFeeder.feederNumberOfPortions = request.numberOfPortions;
    petFeeder.feederPortionSize = request.portionSize;
    await this._homeDeviceRepository.save(petFeeder);
  }

  private async _getPetFeederDevice(id: number): Promise<HomeDevice> {
    const petFeeder: HomeDevice | null = await this._homeDeviceRepository.findOneBy({ id });

    if (!petFeeder) {
      throw new NotFoundException('Pet feeder not found');
    }

    if (petFeeder.deviceType !== DeviceType.PET_FEEDER) {
      throw new NotFoundException('Pet feeder is not a pet feeder');
    }

    return petFeeder;
  }
}
