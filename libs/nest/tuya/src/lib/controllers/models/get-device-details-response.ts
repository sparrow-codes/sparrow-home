import { ApiProperty } from '@nestjs/swagger';

import { TuyaDeviceDetailsDto } from '../../models/tuya-device-details-dto';

export class GetDeviceDetailsResponse {
  @ApiProperty()
  public deviceDetails!: TuyaDeviceDetailsDto;
}
