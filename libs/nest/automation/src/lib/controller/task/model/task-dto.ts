import { ApiProperty } from '@nestjs/swagger';
import { TaskActionDto } from './task-action-dto';

export class TaskDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty({ nullable: true, type: 'number', isArray: true })
  public daysOfWeek!: number[] | null;

  @ApiProperty({ type: TaskActionDto, isArray: true })
  public actions!: TaskActionDto[];
}
