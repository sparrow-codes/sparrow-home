import { ApiProperty } from '@nestjs/swagger';

import { HomeDeviceDetailsDto } from './home-device-details-dto';

export class PetFeederDetailsDto extends HomeDeviceDetailsDto {
  @ApiProperty()
  public numberOfPortions: number | null = null;

  @ApiProperty()
  public portionSize: number | null = null;
}
