import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from './home-device-details-dto';

export class TemperatureSensorDetailsDto extends HomeDeviceDetailsDto {
  @ApiProperty()
  public battery?: number;
  @ApiProperty()
  public temperature?: number;
  @ApiProperty()
  public humidity?: number;
}
