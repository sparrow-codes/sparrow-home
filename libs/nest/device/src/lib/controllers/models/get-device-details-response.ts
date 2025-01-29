import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from '../../models/home-device-details-dto';

export class GetDeviceDetailsResponse {
  @ApiProperty({
    type: HomeDeviceDetailsDto,
    nullable: true,
  })
  public deviceDetails!: HomeDeviceDetailsDto | null;
}
