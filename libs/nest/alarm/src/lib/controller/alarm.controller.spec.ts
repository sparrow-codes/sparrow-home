import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@sparrow-server/auth';

import { AlarmService } from '../services/alarm.service';
import { AlarmController } from './alarm.controller';
import { GetAlarmModeResponse } from './model/get-alarm-mode.response';

type AlarmServiceMock = {
  setAlarmMode: jest.Mock<Promise<void>, [boolean]>;
  getAlarmMode: jest.Mock<Promise<GetAlarmModeResponse>, []>;
  getSirensStatus: jest.Mock<Promise<boolean>, []>;
};

const createAlarmServiceMock: () => AlarmServiceMock = (): AlarmServiceMock => ({
  setAlarmMode: jest.fn(),
  getAlarmMode: jest.fn(),
  getSirensStatus: jest.fn(),
});

describe('AlarmController', () => {
  let moduleRef: TestingModule;
  let controller: AlarmController;
  let alarmService: AlarmServiceMock;

  beforeEach(async () => {
    alarmService = createAlarmServiceMock();

    moduleRef = await Test.createTestingModule({
      controllers: [AlarmController],
      providers: [{ provide: AlarmService, useValue: alarmService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();

    controller = moduleRef.get(AlarmController);
  });

  afterEach(async () => {
    await moduleRef?.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a class-level guard (AuthGuard) applied', () => {
    // Ensures @UseGuards(...) is present at the class level.
    const guards = Reflect.getMetadata(GUARDS_METADATA, AlarmController);
    expect(guards).toBeDefined();
    expect(Array.isArray(guards)).toBe(true);
    expect(guards!.length).toBeGreaterThan(0);
  });

  describe('setAlarmMode', () => {
    it('should call AlarmService.setAlarmMode with the request payload', async () => {
      alarmService.setAlarmMode.mockResolvedValue(undefined);

      await controller.setAlarmMode({ isActive: true });

      expect(alarmService.setAlarmMode).toHaveBeenCalledTimes(1);
      expect(alarmService.setAlarmMode).toHaveBeenCalledWith(true);
    });

    it('should propagate errors from AlarmService.setAlarmMode', async () => {
      const err = new Error('boom');
      alarmService.setAlarmMode.mockRejectedValue(err);

      await expect(controller.setAlarmMode({ isActive: false })).rejects.toThrow('boom');
    });
  });

  describe('getAlarmMode', () => {
    it('should return the value from AlarmService.getAlarmMode', async () => {
      const mockedResults: GetAlarmModeResponse = { isActive: true, isAvailable: true };

      alarmService.getAlarmMode.mockResolvedValue(mockedResults);

      const response: GetAlarmModeResponse = await controller.getAlarmMode();

      expect(alarmService.getAlarmMode).toHaveBeenCalledTimes(1);
      expect(response.isActive).toBe(mockedResults.isActive);
      expect(response.isAvailable).toBe(mockedResults.isAvailable);
    });

    it('should propagate errors from AlarmService.getAlarmMode', async () => {
      const err: Error = new Error('read-failed');
      alarmService.getAlarmMode.mockRejectedValue(err);

      await expect(controller.getAlarmMode()).rejects.toThrow('read-failed');
    });
  });

  describe('getSirensStatus', () => {
    it('should return the value from AlarmService.getSirensStatus', async () => {
      alarmService.getSirensStatus.mockResolvedValue(false);

      const result: boolean = await controller.getSirensStatus();

      expect(alarmService.getSirensStatus).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should propagate errors from AlarmService.getSirensStatus', async () => {
      const err: Error = new Error('status-unavailable');
      alarmService.getSirensStatus.mockRejectedValue(err);

      await expect(controller.getSirensStatus()).rejects.toThrow('status-unavailable');
    });
  });
});
