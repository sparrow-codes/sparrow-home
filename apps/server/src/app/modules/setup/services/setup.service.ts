import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/enitities/user';
import { SetConfigurationRequest } from '../controlers/models/set-configuration.request';
import { Setup } from '../enitites/setup';

@Injectable()
export class SetupService {
  public constructor(
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {}

  public async isConfigurationReady(): Promise<void> {
    const setups: Setup[] = await this._setupRepository.find();
    const allUsers: User[] = await this._userRepository.find();
    if (allUsers.length === 0 || setups.length === 0) {
      throw new UnauthorizedException();
    }
  }

  public async setMode(mode: number): Promise<void> {
    const setup: Setup = await this.getSetup();

    setup.mode = mode;
    await this._setupRepository.save(setup);
  }

  public async saveConfiguration(request: SetConfigurationRequest): Promise<void> {
    const setup: Setup = await this.getSetup();

    setup.lat = request.lat;
    setup.lng = request.lng;

    await this._setupRepository.save(setup);
  }

  public async getSetup(): Promise<Setup> {
    const setup: Setup[] = await this._setupRepository.find();
    return setup[0];
  }
}
