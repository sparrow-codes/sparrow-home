import { IsNotEmpty } from 'class-validator';

export class ScheduledWaterHeatingRequest {
  @IsNotEmpty()
  public active!: boolean;
}
