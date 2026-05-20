import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Setup, User, UserRole } from '@sparrow-server/entities';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateNewUserRequest } from '../controller/model/create-new-user-request';
import { UserService } from './user.service';

type UserRepositoryMock = jest.Mocked<Pick<Repository<User>, 'findOneBy' | 'findBy' | 'save' | 'existsBy'>>;
type SetupRepositoryMock = jest.Mocked<Pick<Repository<Setup>, 'save'>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepositoryMock;
  let setupRepository: SetupRepositoryMock;

  beforeEach(async () => {
    userRepository = {
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      existsBy: jest.fn(),
    };

    setupRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Setup), useValue: setupRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createAdditionalUser', () => {
    it('should create additional user with owner setup and hashed password', async () => {
      const ownerSetup: Setup = new Setup();
      ownerSetup.id = 10;

      const owner: User = new User();
      owner.id = 1;
      owner.userRole = UserRole.OWNER;
      owner.setup = ownerSetup;
      owner.email = 'test@test.com';

      const request: CreateNewUserRequest = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'Secret123!',
      };

      const hashSpy: jest.SpiedFunction<typeof bcrypt.hash> = jest.spyOn(bcrypt, 'hash');

      userRepository.findOneBy.mockResolvedValue(owner);
      userRepository.save.mockResolvedValue(new User());

      await service.createAdditionalUser(request);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ userRole: UserRole.OWNER });
      expect(hashSpy).toHaveBeenCalledWith(request.password, 10);
      expect(userRepository.save).toHaveBeenCalledTimes(1);

      const savedUser: User = userRepository.save.mock.calls[0][0] as User;
      expect(savedUser.firstName).toBe(request.firstName);
      expect(savedUser.lastName).toBe(request.lastName);
      expect(savedUser.email).toBe(request.email);
      expect(savedUser.password).not.toBe(request.password);
      expect(await bcrypt.compare(request.password, savedUser.password)).toBe(true);
      expect(savedUser.userRole).toBe(UserRole.ADDITIONAL);
      expect(savedUser.isActive).toBe(false);
      expect(savedUser.setup).toBe(ownerSetup);
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      const request: CreateNewUserRequest = {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        password: 'Secret123!',
      };

      const hashSpy: jest.SpiedFunction<typeof bcrypt.hash> = jest.spyOn(bcrypt, 'hash');

      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.createAdditionalUser(request)).rejects.toBeInstanceOf(NotFoundException);
      expect(hashSpy).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when email is already taken', async () => {
      const ownerSetup: Setup = new Setup();
      ownerSetup.id = 11;

      const owner: User = new User();
      owner.id = 2;
      owner.userRole = UserRole.OWNER;
      owner.setup = ownerSetup;
      owner.email = 'eve@example.com';

      const request: CreateNewUserRequest = {
        firstName: 'Eve',
        lastName: 'Stone',
        email: 'eve@example.com',
        password: 'Secret123!',
      };

      const duplicateEmailError: Error = new ConflictException('Email is already in use. Please choose another one.');

      userRepository.findOneBy.mockResolvedValue(owner);
      userRepository.existsBy.mockResolvedValue(true);

      await expect(service.createAdditionalUser(request)).rejects.toThrow(duplicateEmailError);

      expect(userRepository.save).toHaveBeenCalledTimes(0);
    });
  });
});
