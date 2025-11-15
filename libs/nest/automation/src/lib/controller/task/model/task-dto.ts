import { ApiProperty } from '@nestjs/swagger';
import { TaskActionDto } from './task-action-dto';

export class TaskDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty({ type: TaskActionDto, isArray: true })
  public actions!: TaskActionDto[];
}
