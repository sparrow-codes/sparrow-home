import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceType, HomeDevice } from '@sparrow-server/entities';
import { ZigbeePetFeederService } from '@sparrow-server/external-api';
import { ObjectLiteral, Repository } from 'typeorm';

import { SetPetFeederConfig } from '../../controllers/models/set-pet-feeder-config'; // ← adjust path
import { PetFeederOperationsService } from './pet-feeder-operations.service';

type RepoMock<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createRepositoryMock = <T extends ObjectLiteral>(): RepoMock<T> => ({
  findOneBy: jest.fn(),
});

describe('PetFeederOperationsService', () => {
  let service: PetFeederOperationsService;
  let repo: RepoMock<HomeDevice>;
  let zigbeePetFeederServiceMock: jest.Mocked<ZigbeePetFeederService>;

  beforeEach(async () => {
    repo = createRepositoryMock<HomeDevice>();
    zigbeePetFeederServiceMock = {
      feedPet: jest.fn(),
      setPetFeederConfiguration: jest.fn(),
    } as unknown as jest.Mocked<ZigbeePetFeederService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetFeederOperationsService,
        { provide: getRepositoryToken(HomeDevice), useValue: repo },
        { provide: ZigbeePetFeederService, useValue: zigbeePetFeederServiceMock },
      ],
    }).compile();

    service = module.get(PetFeederOperationsService);
  });

  describe('feedPet', () => {
    it('throws NotFoundException when device is not found (repo called exactly once)', async () => {
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);

      try {
        await service.feedPet(123);
        fail('Expected NotFoundException to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect((err as NotFoundException).message).toBe('Pet feeder not found');
      }

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 123 });
      expect(zigbeePetFeederServiceMock.feedPet).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when device type is not PET_FEEDER (repo called exactly once)', async () => {
      const device: HomeDevice = {
        id: 10,
        zigbeeDeviceId: 'zig-10',
        deviceType: DeviceType.POWER_PLUG, // wrong type
        deviceName: 'Plug',
        battery: null,
        signalStrength: null,
        temperature: null,
        isOpen: null,
        lastOpened: null,
        feederPortionSize: null,
        feederNumberOfPortions: null,
        task: undefined,
      } as HomeDevice;

      (repo.findOneBy as jest.Mock).mockResolvedValue(device);

      try {
        await service.feedPet(10);
        fail('Expected NotFoundException to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect((err as NotFoundException).message).toBe('Pet feeder is not a pet feeder');
      }

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 10 });
      expect(zigbeePetFeederServiceMock.feedPet).not.toHaveBeenCalled();
    });

    it('calls ZigbeePetFeederService.feedPet with zigbeeDeviceId when device is PET_FEEDER (repo called exactly once)', async () => {
      const device: HomeDevice = {
        id: 7,
        zigbeeDeviceId: 'zig-feeder-7',
        deviceType: DeviceType.PET_FEEDER,
        deviceName: 'Kitchen Feeder',
        battery: null,
        signalStrength: null,
        temperature: null,
        isOpen: null,
        lastOpened: null,
        feederPortionSize: null,
        feederNumberOfPortions: null,
        task: undefined,
      } as HomeDevice;

      (repo.findOneBy as jest.Mock).mockResolvedValue(device);

      await service.feedPet(7);

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 7 });
      expect(zigbeePetFeederServiceMock.feedPet).toHaveBeenNthCalledWith(1, 'zig-feeder-7');
    });
  });

  describe('setPetFeederOptions', () => {
    it('throws NotFoundException when device is not found (repo called exactly once)', async () => {
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        service.setPetFeederOptions(123, { numberOfPortions: 3, portionSize: 20 } as SetPetFeederConfig)
      ).rejects.toThrow('Pet feeder not found');

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 123 });
      expect(zigbeePetFeederServiceMock.setPetFeederConfiguration).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when device type is not PET_FEEDER (repo called exactly once)', async () => {
      const device: HomeDevice = {
        id: 10,
        zigbeeDeviceId: 'zig-10',
        deviceType: DeviceType.POWER_PLUG, // wrong type
        deviceName: 'Plug',
        battery: null,
        signalStrength: null,
        temperature: null,
        isOpen: null,
        lastOpened: null,
        feederPortionSize: null,
        feederNumberOfPortions: null,
        task: undefined,
      } as HomeDevice;

      (repo.findOneBy as jest.Mock).mockResolvedValue(device);

      await expect(
        service.setPetFeederOptions(10, { numberOfPortions: 2, portionSize: 15 } as SetPetFeederConfig)
      ).rejects.toThrow('Pet feeder is not a pet feeder');

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 10 });
      expect(zigbeePetFeederServiceMock.setPetFeederConfiguration).not.toHaveBeenCalled();
    });

    it('calls ZigbeePetFeederService.setPetFeederConfiguration with proper args (repo called exactly once)', async () => {
      const device: HomeDevice = {
        id: 7,
        zigbeeDeviceId: 'zig-feeder-7',
        deviceType: DeviceType.PET_FEEDER,
        deviceName: 'Kitchen Feeder',
        battery: null,
        signalStrength: null,
        temperature: null,
        isOpen: null,
        lastOpened: null,
        feederPortionSize: null,
        feederNumberOfPortions: null,
        task: undefined,
      } as HomeDevice;

      (repo.findOneBy as jest.Mock).mockResolvedValue(device);

      const req: SetPetFeederConfig = { numberOfPortions: 3, portionSize: 20 };

      await service.setPetFeederOptions(7, req);

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 7 });
      expect(zigbeePetFeederServiceMock.setPetFeederConfiguration).toHaveBeenNthCalledWith(1, 'zig-feeder-7', 3, 20);
    });
  });
});
