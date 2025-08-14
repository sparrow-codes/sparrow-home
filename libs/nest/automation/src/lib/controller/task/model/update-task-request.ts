import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public from?: Date;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public to?: Date;

  @ApiProperty({ required: true, type: Number, isArray: true })
  public assignedDevices!: number[];
}
