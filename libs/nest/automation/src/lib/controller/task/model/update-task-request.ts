import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ActionJobDto } from './action-job.dto';

export class UpdateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ required: false, nullable: true, type: 'number', isArray: true })
  public daysOfTheWeek!: number[] | null;

  @ApiProperty({ type: ActionJobDto, isArray: true, nullable: true })
  public actions: ActionJobDto[] | null = null;
}
