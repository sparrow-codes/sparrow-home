import { createHash } from 'node:crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceLastState } from '@sparrow-server/entities';
import { ObjectLiteral, Repository } from 'typeorm';

import { stableStringify } from '../../functions/stable-stringify/stable-stringify';
import { DeviceState } from '../../model/device-state';
import { DeviceStateService } from './device-state.service';

type MockRepository<T extends ObjectLiteral> = {
  find: jest.Mock<Promise<T[]>, []>;
  remove: jest.Mock;
  save: jest.Mock<Promise<T | undefined>, [Partial<T>]>;
} & Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DeviceStateService', () => {
  let service: DeviceStateService;
  let repo: MockRepository<DeviceLastState>;

  beforeEach(async () => {
    repo = {
      find: jest.fn<Promise<DeviceLastState[]>, []>(),
      remove: jest.fn(),
      save: jest.fn<Promise<DeviceLastState | undefined>, [Partial<DeviceLastState>]>().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceStateService,
        {
          provide: getRepositoryToken(DeviceLastState),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<DeviceStateService>(DeviceStateService);
  });

  afterEach(() => jest.clearAllMocks());

  it('getState returns Map of deviceId -> state', async () => {
    const rows: Partial<DeviceLastState & { deviceId: string; state: DeviceState }>[] = [
      { deviceId: 'dev1', state: { on: true } },
      { deviceId: 'dev2', state: { on: false } },
    ];
    repo.find.mockResolvedValue(rows as DeviceLastState[]);

    const result: Map<string, DeviceState> = await service.getState();
    expect(result instanceof Map).toBe(true);
    expect(result.size).toBe(2);
    expect(result.get('dev1')).toEqual({ on: true });
    expect(result.get('dev2')).toEqual({ on: false });
  });

  it('setState saves when hash differs', async () => {
    const newState: DeviceState = { foo: 'bar' };
    const deviceId: string = 'dev1';
    const entity: DeviceLastState = new DeviceLastState();
    entity.deviceId = deviceId;
    entity.state = { foo: 'old' };
    entity.stateHash = 'oldhash';
    entity.updatedAt = new Date();

    repo.find.mockResolvedValue([entity]);

    const map: Map<string, DeviceState> = new Map<string, DeviceState>([[deviceId, newState]]);

    await service.setState(map);

    // expected hash
    const expectedHash: string = createHash('sha1')
      .update(stableStringify(newState) as string)
      .digest('hex');

    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedArg: Partial<DeviceLastState> = (repo.save as jest.Mock).mock.calls[0][0] as Partial<DeviceLastState>;
    expect(savedArg.state).toEqual(newState);
    expect(savedArg.stateHash).toBe(expectedHash);
  });

  it('setState does not save when hash is equal', async () => {
    const state: DeviceState = { a: 1 };
    const deviceId: string = 'dev1';
    const sameHash: string = createHash('sha1')
      .update(stableStringify(state) as string)
      .digest('hex');
    const entity: DeviceLastState = new DeviceLastState();
    entity.deviceId = deviceId;
    entity.state = { a: 1 };
    entity.stateHash = sameHash;
    entity.updatedAt = new Date();

    repo.find.mockResolvedValue([entity]);

    const map: Map<string, DeviceState> = new Map<string, DeviceState>([[deviceId, state]]);

    await service.setState(map);

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('setState logs warning when device not found', async () => {
    repo.find.mockResolvedValue([]);
    const map: Map<string, DeviceState> = new Map<string, DeviceState>([['missing', { x: 1 }]]);

    const logger: { warn: (...args: unknown[]) => void } = (
      service as unknown as { _logger: { warn: (...args: unknown[]) => void } }
    )._logger;
    const warnSpy: jest.SpyInstance<void, unknown[]> = jest.spyOn(logger, 'warn');

    await service.setState(map);

    expect(warnSpy).toHaveBeenCalled();
    const msg: string = (warnSpy.mock.calls[0][0] as string) || '';
    expect(msg).toContain('Device with id missing not found in database');
  });
});
