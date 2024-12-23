import { ApiProperty } from '@nestjs/swagger';

export class TuyaDeviceDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public tuyaDeviceId!: string;
  @ApiProperty()
  public name!: string;
}
