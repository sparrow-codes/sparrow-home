import { ApiProperty } from '@nestjs/swagger';

export class HomeDeviceDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public zigbeeDeviceId!: string;
  @ApiProperty()
  public name!: string;
}
