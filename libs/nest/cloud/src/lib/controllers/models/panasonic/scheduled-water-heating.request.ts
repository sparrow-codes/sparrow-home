import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ScheduledWaterHeatingRequest {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public active!: boolean;
}
