import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SetupService {
  public constructor(@InjectRepository(User) private readonly _userRepository: Repository<User>) {}

  public async isConfigurationReady(): Promise<void> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }
  }
}
