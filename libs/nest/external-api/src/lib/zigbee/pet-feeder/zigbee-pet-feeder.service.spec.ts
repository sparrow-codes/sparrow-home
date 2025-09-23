import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';
import { Test, TestingModule } from '@nestjs/testing';

import { ZigbeePetFeederService } from './zigbee-pet-feeder.service';

describe('ZigbeePetFeederService', () => {
  let service: ZigbeePetFeederService;
  let publishMock: jest.Mock;
  let mockMqttClient: Partial<MqttClient>;
  let mockClientMqtt: Partial<ClientMqtt>;

  beforeEach(async () => {
    publishMock = jest.fn();
    mockMqttClient = {
      publish: publishMock,
    };

    mockClientMqtt = {
      createClient: jest.fn().mockReturnValue(mockMqttClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ZigbeePetFeederService, { provide: 'ZIGBEE', useValue: mockClientMqtt }],
    }).compile();

    service = module.get(ZigbeePetFeederService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('feedPet', () => {
    it('should publish feed event', () => {
      const deviceId: string = 'kitchen-feeder-1';
      const expectedTopic: string = `zigbee2mqtt/${deviceId}/set`;
      const expectedPayload: string = JSON.stringify({ feed: 'START' });

      service.feedPet(deviceId);

      expect(publishMock).toHaveBeenCalledTimes(1);
      expect(publishMock).toHaveBeenNthCalledWith(1, expectedTopic, expectedPayload);
    });
  });

  describe('setPetFeederConfiguration', () => {
    it('should publish set number of portions event', () => {
      const deviceId: string = 'kitchen-feeder-1';
      const expectedTopic: string = `zigbee2mqtt/${deviceId}/set`;
      const expectedPayload: string = JSON.stringify({ serving_size: 2, mode: 'manual', portion_weight: 20 });

      service.setPetFeederConfiguration(deviceId, 2, 20);
      expect(publishMock).toHaveBeenNthCalledWith(1, expectedTopic, expectedPayload);
    });

    it('should not publish on lower portion than minimum', () => {
      const deviceId: string = 'kitchen-feeder-1';
      service.setPetFeederConfiguration(deviceId, 0, 20);

      expect(publishMock).toHaveBeenCalledTimes(0);
    });

    it('should not publish on larger portion than maximum', () => {
      const deviceId: string = 'kitchen-feeder-1';
      service.setPetFeederConfiguration(deviceId, 11, 20);

      expect(publishMock).toHaveBeenCalledTimes(0);
    });

    it('should not publish on lower portion than minimum', () => {
      const deviceId: string = 'kitchen-feeder-1';
      service.setPetFeederConfiguration(deviceId, 1, 0);

      expect(publishMock).toHaveBeenCalledTimes(0);
    });

    it('should not publish on larger portion than maximum', () => {
      const deviceId: string = 'kitchen-feeder-1';
      service.setPetFeederConfiguration(deviceId, 1, 21);

      expect(publishMock).toHaveBeenCalledTimes(0);
    });
  });
});
