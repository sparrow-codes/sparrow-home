import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ActionJobDto } from './action-job.dto';

export class CreateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ type: ActionJobDto, isArray: true, nullable: true })
  public actions: ActionJobDto[] | null = null;
}
