import { ApiProperty } from '@nestjs/swagger';

export abstract class HomeDeviceDetailsDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public zigbeeDeviceId!: string;
  @ApiProperty()
  public name!: string;
  @ApiProperty({ type: 'boolean' })
  public isOnline!: boolean;
}
