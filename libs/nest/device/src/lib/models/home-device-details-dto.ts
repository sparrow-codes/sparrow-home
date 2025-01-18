import { ApiProperty } from '@nestjs/swagger';

export abstract class HomeDeviceDetailsDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public homeDeviceId!: string;
  @ApiProperty()
  public name!: string;
  @ApiProperty({ type: 'boolean' })
  public isOnline!: boolean;
  @ApiProperty()
  public signalStrength!: number;
}
