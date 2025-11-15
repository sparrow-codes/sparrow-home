import { ApiProperty } from '@nestjs/swagger';
import { DeviceActionDto } from '@sparrow-server/shared';

export class TaskActionDto {
  @ApiProperty()
  public zigbeeDeviceId!: string;

  @ApiProperty()
  public deviceName!: string;

  @ApiProperty()
  public deviceDescription!: string;

  @ApiProperty({ type: Date })
  public executionTime!: Date;

  @ApiProperty({ type: DeviceActionDto, nullable: false })
  public action!: DeviceActionDto;
}
