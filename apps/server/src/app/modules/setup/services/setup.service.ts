import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../../../entities/user';
import { UserRole } from '../../user/enum/user-role';
import { UserService } from '../../user/services/user.service';
import { SetConfigurationRequest } from '../controlers/models/set-configuration.request';
import { ModeService } from './mode/mode.service';

@Injectable()
export class SetupService {
  public constructor(private readonly _modeService: ModeService, private readonly _userService: UserService) {}

  public async isConfigurationReady(): Promise<void> {
    const user: User | null = await this._userService.getUserByRole(UserRole.OWNER);
    if (!user) {
      throw new UnauthorizedException();
    }
  }

  public async setMode(mode: number, userId: number): Promise<void> {
    await this._modeService.setMode(mode, userId);
  }

  public async saveConfiguration(request: SetConfigurationRequest, userId: number): Promise<void> {
    const user: User = await this._userService.getUserById(userId);
    user.setup.lat = request.lat;
    user.setup.lng = request.lng;
    user.setup.marginTemperatureOverNight = request.marginTemperatureOverNight;
    console.log(JSON.stringify(user));
    await this._userService.save({ ...user });
  }
}
