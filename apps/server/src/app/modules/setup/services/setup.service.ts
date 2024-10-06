import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/enitities/user';
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
    const setup: Setup[] = await this._setupRepository.find();
    const first: Setup = setup[0];

    first.mode = mode;
    await this._setupRepository.save(first);
  }

  public getSetup(): Promise<Setup[]> {
    return this._setupRepository.find();
  }
}
