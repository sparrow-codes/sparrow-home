import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../../../entities/user';
import { UserRole } from '../../../enums/user-role';
import { UserService } from '../../user/services/user.service';
import { SetConfigurationRequest } from '../controlers/models/set-configuration.request';

@Injectable()
export class SetupService {
  public constructor(private readonly _userService: UserService) {}

  public async isConfigurationReady(): Promise<void> {
    const user: User | null = await this._userService.getUserByRole(UserRole.OWNER);
    if (!user) {
      throw new UnauthorizedException();
    }
  }

  public async saveConfiguration(request: SetConfigurationRequest): Promise<void> {
    const user: User = await this._userService.getUserByRole(UserRole.OWNER);
    user.setup.lat = request.lat;
    user.setup.lng = request.lng;
    await this._userService.save({ ...user });
  }
}
