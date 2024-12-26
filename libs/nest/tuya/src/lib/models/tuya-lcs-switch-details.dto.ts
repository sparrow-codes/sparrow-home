import { ApiProperty } from '@nestjs/swagger';

import { TuyaDeviceDetailsDto } from './tuya-device-details-dto';

export class TuyaLcsSwitchDetailsDto extends TuyaDeviceDetailsDto {
  @ApiProperty()
  public isOn!: boolean;
}
