import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public startTime?: Date;

  @ApiProperty()
  public atSunset?: boolean;

  @ApiProperty()
  public endTime?: Date;

  @ApiProperty({ type: Number, isArray: true })
  public assignedDevices!: number[];

  @ApiProperty()
  public isActive!: boolean;
}
