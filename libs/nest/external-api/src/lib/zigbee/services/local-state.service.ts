import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import { join } from 'path';

import { DeviceState } from '../model/device-state';

@Injectable()
export class LocalStateService {
  private readonly _dirPath = join(process.cwd(), 'data');
  private readonly _filePath = join(this._dirPath, 'local-state.json');
  private readonly _logger: Logger = new Logger(LocalStateService.name);

  public async setState(obj: Map<string, DeviceState>): Promise<void> {
    const json: string = JSON.stringify(Array.from(obj), null, 2);
    await fs.mkdir(this._dirPath, { recursive: true });
    await fs.writeFile(this._filePath, json, 'utf-8');
  }

  public async getState(): Promise<Map<string, DeviceState>> {
    try {
      const data: string = await fs.readFile(this._filePath, 'utf-8');

      return new Map(JSON.parse(data));
    } catch (err) {
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        this._logger.log('No state file found.');
        return new Map();
      }
      throw err;
    }
  }
}
