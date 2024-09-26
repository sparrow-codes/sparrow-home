import { Injectable } from '@nestjs/common';
import find from 'local-devices'

@Injectable()
export class DeviceService {
    public getDeviceListFromWifi(): void {
      find().then(devices => {
        console.log(devices);
      })
    }
}
