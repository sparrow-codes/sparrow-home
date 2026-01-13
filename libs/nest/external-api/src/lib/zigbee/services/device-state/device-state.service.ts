import { createHash } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceLastState } from '@sparrow-server/entities';
import { Repository } from 'typeorm';

import { stableStringify } from '../../functions/stable-stringify/stable-stringify';
import { DeviceState } from '../../model/device-state';

@Injectable()
export class DeviceStateService {
  private readonly _logger: Logger = new Logger(DeviceStateService.name);

  public constructor(
    @InjectRepository(DeviceLastState) private readonly _deviceLastStateRepository: Repository<DeviceLastState>
  ) {}

  public async setState(mapState: Map<string, DeviceState>): Promise<void> {
    const deviceLastStates: DeviceLastState[] = await this._deviceLastStateRepository.find();
    const devicesToBeRemoved: DeviceLastState[] = deviceLastStates.filter(
      (lastState) => !mapState.has(lastState.deviceId)
    );

    mapState.forEach((state: DeviceState, deviceId: string) => {
      const entity: DeviceLastState | undefined = deviceLastStates.find(
        (deviceLastState) => deviceLastState.deviceId === deviceId
      );
      if (!entity) {
        this._logger.warn(`Device with id ${deviceId} not found in database!`);
        const newState: DeviceLastState = new DeviceLastState();
        newState.deviceId = deviceId;
        this.saveState(state, newState);

        return;
      }

      this.saveState(state, entity);
    });

    await this._deviceLastStateRepository.remove(devicesToBeRemoved);
  }

  public async getState(): Promise<Map<string, DeviceState>> {
    const deviceLastStates: DeviceLastState[] = await this._deviceLastStateRepository.find();
    return new Map(deviceLastStates.map((deviceLastState) => [deviceLastState.deviceId, deviceLastState.state]));
  }

  private async saveState(state: DeviceState, entity: DeviceLastState): Promise<void> {
    const hash: string = this.hashDeviceState(state);

    if (hash !== entity.stateHash) {
      entity.state = state;
      entity.stateHash = hash;
      await this._deviceLastStateRepository.save(entity);
    }
  }

  private hashDeviceState(state: Record<string, unknown>): string {
    return createHash('sha1').update(stableStringify(state)).digest('hex');
  }
}
