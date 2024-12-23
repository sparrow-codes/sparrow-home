import { ApiProperty } from '@nestjs/swagger';

export class TuyaDeviceDTO {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public tuyaDeviceId!: string;
  @ApiProperty()
  public name!: string;
}
