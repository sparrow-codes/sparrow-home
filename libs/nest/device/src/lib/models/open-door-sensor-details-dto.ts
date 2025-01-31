import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from './home-device-details-dto';

export class OpenDoorSensorDetailsDto extends HomeDeviceDetailsDto {
  @ApiProperty()
  public battery?: number;

  @ApiProperty()
  public isOpen?: boolean;
}
