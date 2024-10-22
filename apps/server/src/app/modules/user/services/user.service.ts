import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { combineLatest, first, from, lastValueFrom, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { CloudPreferences } from '../../../entities/cloud-preferences';
import { Setup } from '../../../entities/setup';
import { User } from '../../../entities/user';
import { CreateNewUserRequest } from '../controller/model/create-new-user-request';
import { UserRole } from '../enum/user-role';

@Injectable()
export class UserService {
  private static readonly HASHING_ROUNDS: number = 10;

  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>,
    @InjectRepository(CloudPreferences) private readonly _cloudPreferencesRepository: Repository<CloudPreferences>
  ) {}

  public async createFirstUser(request: CreateNewUserRequest): Promise<void> {
    if (await this._userRepository.findOneBy({ role: UserRole.OWNER })) {
      throw new UnauthorizedException();
    }

    const user: User = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    user.password = await bcrypt.hash(request.password, UserService.HASHING_ROUNDS);
    user.role = UserRole.OWNER;
    user.isPasswordExpired = false;

    user.setup = await this._setupRepository.save(new Setup());
    user.cloudPreferences = await this._cloudPreferencesRepository.save(new CloudPreferences());

    await this.save(user);
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this._userRepository.findOneBy({ email });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  public async getUserById(id: number): Promise<User | null> {
    const user: User | null = await this._userRepository.findOneBy({ id });

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  public async getUserByRole(role: UserRole): Promise<User | null> {
    const user: User | null = await this._userRepository.findOneBy({ role });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
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
