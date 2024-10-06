import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Mode } from '../../../enums/mode';
import { Setup } from '../../setup/enitites/setup';
import { CreateNewUserRequest } from '../controller/model/create-new-user-request';
import { User } from '../enitities/user';
import { UserRole } from '../enum/user-role';

@Injectable()
export class UserService {
  private static readonly HASHING_ROUNDS: number = 10;

  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Setup) private readonly setupRepository: Repository<Setup>
  ) {}

  public async createFirstUser(request: CreateNewUserRequest): Promise<void> {
    if ((await this.userRepository.count()) !== 0) {
      throw new UnauthorizedException();
    }

    const user: User = new User();
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.email = request.email;
    user.password = await bcrypt.hash(request.password, UserService.HASHING_ROUNDS);
    user.role = UserRole.ADMIN;
    user.isPasswordExpired = false;

    const setup: Setup = new Setup();
    setup.mode = Mode.SUMMER;

    await this.setupRepository.save(setup);
    await this.userRepository.save(user);
  }

  public getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}
