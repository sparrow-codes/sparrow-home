import { ApiProperty } from '@nestjs/swagger';

import { TuyaDeviceDetailsDto } from '../../models/tuya-device-details-dto';

export class GetDeviceDetailsResponse {
  @ApiProperty({
    type: TuyaDeviceDetailsDto,
    required: true,
  })
  public deviceDetails!: TuyaDeviceDetailsDto;
}
