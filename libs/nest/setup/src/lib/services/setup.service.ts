import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

import { GetSetupResponseMapper } from '../controlers/mapper/get-setup-response-mapper';
import { GetSetupResponse } from '../controlers/models/get-setup.response';
import { SetConfigurationRequest } from '../controlers/models/set-configuration.request';

@Injectable()
export class SetupService {
  public constructor(@InjectRepository(User) private readonly _userRepository: Repository<User>) {}

  public async isConfigurationReady(): Promise<void> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }
  }

  public async saveConfiguration(request: SetConfigurationRequest): Promise<void> {
    const user: User = await this._getUser();

    user.setup.lat = request.lat;
    user.setup.lng = request.lng;
    await this._userRepository.save(user);
  }

  public async getUserConfiguration(): Promise<GetSetupResponse> {
    const user: User = await this._getUser();
    return GetSetupResponseMapper.map(user.setup);
  }

  private async _getUser(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
