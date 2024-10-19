import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Setup } from '../../setup/enitites/setup';
import { CreateNewUserRequest } from '../controller/model/create-new-user-request';
import { User } from '../enitities/user';
import { UserRole } from '../enum/user-role';

@Injectable()
export class UserService {
  private static readonly HASHING_ROUNDS: number = 10;

  public constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly _setupRepository: Repository<Setup>
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

  public async save(user: User): Promise<void> {
    await this._userRepository.save(user);
  }
}
