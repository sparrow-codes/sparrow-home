import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmPreferences, Setup, User, UserRole } from '@sparrow-server/entities';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateNewUserRequest } from '../controller/model/create-new-user-request';
import { GetUserDetailsResponse } from '../controller/model/get-user-details.response';
import { AdditionalUserDto } from '../model/additional-user-dto';

@Injectable()
export class UserService {
  private static readonly HASHING_ROUNDS: number = 10;

  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>,
    @InjectRepository(AlarmPreferences) private readonly _alarmPreferencesRepository: Repository<AlarmPreferences>
  ) {}

  public async createFirstUser(request: CreateNewUserRequest): Promise<void> {
    if ((await this._userRepository.findBy({ userRole: UserRole.OWNER })).length) {
      throw new UnauthorizedException();
    }

    const user: User = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    user.password = await bcrypt.hash(request.password, UserService.HASHING_ROUNDS);
    user.userRole = UserRole.OWNER;
    user.isActive = true;
    user.setup = await this._setupRepository.save(new Setup());

    const alarms: AlarmPreferences[] = await this._alarmPreferencesRepository.find();
    user.alarmPreferences = alarms[0];

    await this._userRepository.save(user);
  }

  public async getUserDetails(userId: number): Promise<GetUserDetailsResponse> {
    const user: User | null = await this._userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      firstName: user.firstName,
      email: user.email,
      lastName: user.lastName,
      id: user.id,
      role: user.userRole,
    };
  }

  public async createAdditionalUser(request: CreateNewUserRequest): Promise<void> {
    const owner: User = await this._getOwner();

    const user: User = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    user.password = await bcrypt.hash(request.password, UserService.HASHING_ROUNDS);
    user.userRole = UserRole.ADDITIONAL;
    user.isActive = false;

    user.setup = owner.setup;

    await this._userRepository.save(user);
  }

  public async getListOfAdditionalUsers(): Promise<AdditionalUserDto[]> {
    const users: User[] = await this._userRepository.findBy({ userRole: UserRole.ADDITIONAL });

    return users.map((user) => ({
      id: user.id,
      isActive: user.isActive,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  }

  public async setUserStatus(userId: number, isActive: boolean): Promise<void> {
    const user: User | null = await this._userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }

    user.isActive = isActive;
    await this._userRepository.save(user);
  }

  private async _getOwner(): Promise<User> {
    const user: User | null = await this._userRepository.findOneBy({ userRole: UserRole.OWNER });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
