import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmPreferences, AquaPreferences, CloudPreferences, Setup, User, UserRole } from '@sparrow-server/entities';
import * as bcrypt from 'bcrypt';
import { combineLatest, first, from, lastValueFrom, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { CreateNewUserRequest } from '../controller/model/create-new-user-request';

@Injectable()
export class UserService {
  private static readonly HASHING_ROUNDS: number = 10;

  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>,
    @InjectRepository(AquaPreferences) private readonly _aquaPreferencesRepository: Repository<AquaPreferences>,
    @InjectRepository(AlarmPreferences) private readonly _alarmPreferencesRepository: Repository<AlarmPreferences>
  ) {}

  public async createFirstUser(request: CreateNewUserRequest): Promise<void> {
    if ((await this._userRepository.find()).length) {
      throw new UnauthorizedException();
    }

    const user: User = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    user.password = await bcrypt.hash(request.password, UserService.HASHING_ROUNDS);
    user.userRole = UserRole.OWNER;
    user.setup = await this._setupRepository.save(new Setup());
    user.cloudPreferences = await this._cloudPreferencesRepository.save(new CloudPreferences());
    user.aquaPreferences = await this._aquaPreferencesRepository.save(new AquaPreferences());
    user.alarmPreferences = await this._alarmPreferencesRepository.save(new AlarmPreferences());

    await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return lastValueFrom(
      combineLatest([
        from(this._setupRepository.save(user.setup)),
        from(this._cloudPreferencesRepository.save(user.cloudPreferences)),
      ]).pipe(
        first(),
        switchMap(() => this._userRepository.save(user))
      )
    );
  }
}
