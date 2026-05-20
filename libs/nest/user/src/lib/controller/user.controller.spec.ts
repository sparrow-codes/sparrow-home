import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@sparrow-server/auth';
import { Request } from 'express';

import { UserService } from '../services/user.service';
import { ActivateUserRequest } from './model/activate-user-request';
import { CreateNewUserRequest } from './model/create-new-user-request';
import { GetListOfAdditionalUsersResponse } from './model/get-list-of-additional-users.response';
import { GetUserDetailsResponse } from './model/get-user-details.response';
import { UserController } from './user.controller';

// Helper mock types
type UserServiceMock = {
  createFirstUser: jest.Mock;
  createAdditionalUser: jest.Mock;
  setUserStatus: jest.Mock; // Controller calls setUserStatus (not activateUser)
  getListOfAdditionalUsers: jest.Mock;
  getUserDetails: jest.Mock;
  isEmailUnique: jest.Mock;
};

type AuthServiceMock = {
  extractTokenFromHeader: jest.Mock;
  getUserIdFromToken: jest.Mock;
};

const createUserServiceMock: () => UserServiceMock = (): UserServiceMock => ({
  createFirstUser: jest.fn(),
  createAdditionalUser: jest.fn(),
  setUserStatus: jest.fn(),
  getListOfAdditionalUsers: jest.fn(),
  getUserDetails: jest.fn(),
  isEmailUnique: jest.fn(),
});

const createAuthServiceMock: () => AuthServiceMock = (): AuthServiceMock => ({
  extractTokenFromHeader: jest.fn(),
  getUserIdFromToken: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let userService: UserServiceMock;
  let authService: AuthServiceMock;

  beforeEach(() => {
    userService = createUserServiceMock();
    authService = createAuthServiceMock();
    controller = new UserController(userService as unknown as UserService, authService as unknown as AuthService);
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {
    it('should call userService.createFirstUser with request body', async () => {
      const body: CreateNewUserRequest = {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'P@ssw0rd',
      };

      await controller.createNewUser(body);

      expect(userService.createFirstUser).toHaveBeenCalledTimes(1);
      expect(userService.createFirstUser).toHaveBeenCalledWith(body);
    });
  });

  describe('createAdditionalUser', () => {
    it('should call userService.createAdditionalUser with request body', async () => {
      const body: CreateNewUserRequest = {
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        password: 'C0B0L',
      };

      await controller.createAdditionalUser(body);

      expect(userService.createAdditionalUser).toHaveBeenCalledTimes(1);
      expect(userService.createAdditionalUser).toHaveBeenCalledWith(body);
    });
  });

  describe('activateUser', () => {
    it('should call userService.setUserStatus with userId and isActive', async () => {
      const body: ActivateUserRequest = { userId: 42, isActive: true };

      await controller.activateUser(body);

      expect(userService.setUserStatus).toHaveBeenCalledTimes(1);
      expect(userService.setUserStatus).toHaveBeenCalledWith(42, true);
    });
  });

  describe('getListOfAdditionalUsers', () => {
    it('should return object with mapped list of additional users', async () => {
      userService.getListOfAdditionalUsers.mockResolvedValue([
        { id: 1, firstName: 'Amy', lastName: 'Wong', isActive: true },
        { id: 2, firstName: 'Bender', lastName: 'Rodriguez', isActive: false },
      ]);

      const result: GetListOfAdditionalUsersResponse = await controller.getListOfAdditionalUsers();

      expect(userService.getListOfAdditionalUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        users: [
          { id: 1, firstName: 'Amy', lastName: 'Wong', isActive: true },
          { id: 2, firstName: 'Bender', lastName: 'Rodriguez', isActive: false },
        ],
      });
    });
  });

  describe('getUserDetails', () => {
    it('should throw UnauthorizedException when Authorization header is missing', async () => {
      const req: Request = { headers: {} } as unknown as Request;

      await expect(controller.getUserDetails(req)).rejects.toThrow(UnauthorizedException);
      expect(authService.extractTokenFromHeader).not.toHaveBeenCalled();
      expect(authService.getUserIdFromToken).not.toHaveBeenCalled();
      expect(userService.getUserDetails).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token could not be extracted', async () => {
      const req: Request = { headers: { authorization: 'Malformed header' } } as unknown as Request;
      authService.extractTokenFromHeader.mockReturnValue(null);

      await expect(controller.getUserDetails(req)).rejects.toThrow(UnauthorizedException);

      expect(authService.extractTokenFromHeader).toHaveBeenCalledWith('Malformed header');
      expect(authService.getUserIdFromToken).not.toHaveBeenCalled();
      expect(userService.getUserDetails).not.toHaveBeenCalled();
    });

    it('should return user details when token is valid', async () => {
      const req: Request = { headers: { authorization: 'Bearer valid.token' } } as unknown as Request;

      authService.extractTokenFromHeader.mockReturnValue('valid.token');
      authService.getUserIdFromToken.mockResolvedValue(7);

      const details: GetUserDetailsResponse = {
        id: 7,
        firstName: 'Linus',
        lastName: 'Torvalds',
        email: 'linus@example.com',
        role: 1,
      };
      userService.getUserDetails.mockResolvedValue(details);

      const result: GetUserDetailsResponse = await controller.getUserDetails(req);

      expect(authService.extractTokenFromHeader).toHaveBeenCalledWith('Bearer valid.token');
      expect(authService.getUserIdFromToken).toHaveBeenCalledWith('valid.token');
      expect(userService.getUserDetails).toHaveBeenCalledWith(7);
      expect(result).toEqual(details);
    });
  });
});
