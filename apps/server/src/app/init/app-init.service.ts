import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { ModeService } from '../modules/setup/services/mode/mode.service';
import { User } from '../modules/user/enitities/user';
import { UserRole } from '../modules/user/enum/user-role';
import { UserService } from '../modules/user/services/user.service';

@Injectable()
export class AppInitService {
  public constructor(private readonly _userService: UserService, private readonly _modeService: ModeService) {}

  public async onInit(): Promise<void> {
    Logger.log('Verifying application configuration');
    try {
      const owner: User = await this._userService.getUserByRole(UserRole.OWNER);
      await this.verifyMode(owner);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        Logger.log('No user found. Initial configuration required');
      } else {
        Logger.error(error);
      }
    }
  }

  private async verifyMode(owner: User): Promise<void> {
    if (owner.setup && owner.setup?.mode) {
      await this._modeService.setMode(owner.setup.mode, owner.id, true);
    }
  }
}
