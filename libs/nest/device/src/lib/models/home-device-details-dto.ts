import { ApiProperty } from '@nestjs/swagger';
import { DeviceActionDto } from '@sparrow-server/shared';

export abstract class HomeDeviceDetailsDto {
  @ApiProperty()
  public id!: number;
  @ApiProperty()
  public type!: number;
  @ApiProperty()
  public homeDeviceId!: string;
  @ApiProperty()
  public name!: string;
  @ApiProperty()
  public vendor!: string;
  @ApiProperty()
  public model!: string;
  @ApiProperty()
  public description!: string;
  @ApiProperty({ type: 'boolean' })
  public isOnline!: boolean;
  @ApiProperty()
  public signalStrength!: number;
  @ApiProperty({ nullable: true })
  public battery: number | null = null;
  @ApiProperty()
  public params: Record<string, string> = {};
  @ApiProperty({ type: DeviceActionDto, isArray: true })
  public actions: DeviceActionDto[] = [];
  @ApiProperty({ nullable: true })
  public mainActionKey: string | null = null;
  @ApiProperty({ nullable: true })
  public mainParamKey: string | null = null;
}
