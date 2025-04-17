import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from './home-device-details-dto';

export class PilotDetailsDto extends HomeDeviceDetailsDto {
  @ApiProperty()
  public battery?: number;
}
