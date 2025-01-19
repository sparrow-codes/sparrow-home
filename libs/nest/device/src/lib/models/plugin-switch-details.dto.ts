import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from './home-device-details-dto';

export class PluginSwitchDetailsDto extends HomeDeviceDetailsDto {
  @ApiProperty()
  public isOn?: boolean;
}
