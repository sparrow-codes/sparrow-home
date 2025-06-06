import { ApiProperty } from '@nestjs/swagger';

export class GetHomeAvgTemperature {
  @ApiProperty()
  public avgTemperature: number | null = null;
}
