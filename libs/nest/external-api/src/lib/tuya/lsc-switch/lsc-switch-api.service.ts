import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Commands } from '../model/commands';
import { TuyaApiService } from '../tuya-api.service';

@Injectable()
export class LscSwitchApiService extends TuyaApiService {
  private static readonly _SWITCH_CODE: string = 'switch_1';

  public setSwitch(deviceId: string, isOn: boolean): Observable<boolean> {
    const commands: Commands<boolean>[] = [{ code: LscSwitchApiService._SWITCH_CODE, value: isOn }];
    return this.sendCommands<boolean>(deviceId, commands);
  }
}
