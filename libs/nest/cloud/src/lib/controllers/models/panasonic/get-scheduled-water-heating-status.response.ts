import { ApiProperty } from '@nestjs/swagger';

export class GetScheduledWaterHeatingStatusResponse {
  @ApiProperty()
  public isScheduled!: boolean;
}
