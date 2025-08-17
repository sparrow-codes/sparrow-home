import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public from?: Date;

  @ApiProperty({ required: false })
  public atSunset?: boolean;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public to?: Date;

  @ApiProperty({ required: true, type: Number, isArray: true })
  public assignedDevices!: number[];
}
