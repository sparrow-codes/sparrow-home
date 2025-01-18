import { ApiProperty } from '@nestjs/swagger';

export class HomeDeviceDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public homeDeviceId!: string;
  @ApiProperty()
  public name!: string;
}
