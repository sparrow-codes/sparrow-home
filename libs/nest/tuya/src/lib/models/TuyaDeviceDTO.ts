import { ApiProperty } from '@nestjs/swagger';

export class TuyaDeviceDTO {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;

  @ApiProperty({ nullable: true })
  public name?: string;
}
