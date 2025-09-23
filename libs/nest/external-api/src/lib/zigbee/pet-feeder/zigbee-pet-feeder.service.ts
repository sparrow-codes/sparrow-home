import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface';

@Injectable()
export class ZigbeePetFeederService {
  private readonly _client: MqttClient;

  private static readonly _MINIMUM_NUMBER_OF_PORTIONS: number = 1;
  private static readonly _MAXIMUM_NUMBER_OF_PORTIONS: number = 10;
  private static readonly _PORTION_SIZE_MINIMUM: number = 1;
  private static readonly _PORTION_SIZE_MAXIMUM: number = 20;

  public constructor(@Inject('ZIGBEE') private readonly _zigbeeClient: ClientMqtt) {
    this._client = this._zigbeeClient.createClient();
  }

  public feedPet(zigbeeDeviceId: string): void {
    Logger.log(`Feed event for device ${zigbeeDeviceId}`);
    this._client.publish(`zigbee2mqtt/${zigbeeDeviceId}/set`, JSON.stringify({ feed: 'START' }));
  }

  public setPetFeederConfiguration(zigbeeDeviceId: string, numberOfPortions: number, portionSize: number): void {
    if (numberOfPortions < ZigbeePetFeederService._MINIMUM_NUMBER_OF_PORTIONS) {
      Logger.warn(`Number of portions is too low ${numberOfPortions}`);
      return;
    }

    if (numberOfPortions > ZigbeePetFeederService._MAXIMUM_NUMBER_OF_PORTIONS) {
      Logger.warn(`Number of portions is too high ${numberOfPortions}`);
      return;
    }

    if (portionSize < ZigbeePetFeederService._PORTION_SIZE_MINIMUM) {
      Logger.warn(`Portion size is too low ${portionSize}`);
      return;
    }

    if (portionSize > ZigbeePetFeederService._PORTION_SIZE_MAXIMUM) {
      Logger.warn(`Portion size is too high ${portionSize}`);
      return;
    }

    this._client.publish(
      `zigbee2mqtt/${zigbeeDeviceId}/set`,
      JSON.stringify({ serving_size: numberOfPortions, mode: 'manual', portion_weight: portionSize })
    );
  }
}
