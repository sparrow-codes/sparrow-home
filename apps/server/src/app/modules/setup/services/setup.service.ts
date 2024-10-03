import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '../../user/enitities/user';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class SetupService {
  public constructor(private readonly userService: UserService) {}

  public async isConfigurationReady(): Promise<void> {
    const allUsers: User[] = await this.userService.getAllUsers();
    if (allUsers.length === 0) {
      throw new UnauthorizedException();
    }
  }
}
