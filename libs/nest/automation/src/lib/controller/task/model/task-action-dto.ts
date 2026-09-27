import { ApiProperty } from '@nestjs/swagger';
import { DeviceActionDto } from '@sparrow-server/shared';
import { IsBoolean } from 'class-validator';

export class TaskActionDto {
  @ApiProperty()
  public zigbeeDeviceId!: string;

  @ApiProperty()
  public deviceName!: string;

  @ApiProperty()
  public deviceDescription!: string;

  @ApiProperty({ type: Date })
  public executionTime!: Date;

  @ApiProperty({ nullable: true, type: 'number', isArray: true })
  public daysOfTheWeek!: number[] | null;

  @ApiProperty({ type: DeviceActionDto, nullable: false })
  public action!: DeviceActionDto;

  @ApiProperty({ nullable: false, required: true, default: false, type: Boolean })
  @IsBoolean()
  public runOnVacation: boolean = false;
}
