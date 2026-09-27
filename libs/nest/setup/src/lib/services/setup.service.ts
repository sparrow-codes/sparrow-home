import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setup, User, UserRole } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SetupService {
  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>
  ) {}

  public async isConfigurationReady(): Promise<void> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new UnauthorizedException();
    }
  }

  public async setVacationMode(isVacationMode: boolean): Promise<void> {
    const setup: Setup | null = (await this._setupRepository.find())[0];
    if (!setup) {
      throw new NotFoundException();
    }

    setup.isVacationMode = isVacationMode;
    await this._setupRepository.save(setup);
  }

  public async getVacationMode(): Promise<boolean> {
    const setup: Setup | null = (await this._setupRepository.find())[0];
    if (!setup) {
      throw new NotFoundException();
    }

    return setup.isVacationMode;
  }
}
