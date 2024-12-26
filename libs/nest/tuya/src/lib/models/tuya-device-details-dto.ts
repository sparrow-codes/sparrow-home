import { ApiProperty } from '@nestjs/swagger';

export abstract class TuyaDeviceDetailsDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public tuyaDeviceId!: string;
  @ApiProperty()
  public name!: string;
  @ApiProperty({ type: 'boolean' })
  public isOnline!: boolean;
}
