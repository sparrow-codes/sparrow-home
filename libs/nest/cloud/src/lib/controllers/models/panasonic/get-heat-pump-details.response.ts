import { ApiProperty } from '@nestjs/swagger';

import { TankStatusDto } from './tank-status-dto';
import { ZoneStatusDto } from './zone-status-dto';

export class GetHeatPumpDetailsResponse {
  @ApiProperty()
  public deviceGuid!: string;

  @ApiProperty()
  public outdoorNow!: number;

  @ApiProperty()
  public waterPressure!: string;

  @ApiProperty()
  public zoneStatus!: ZoneStatusDto;

  @ApiProperty()
  public tankStatus!: TankStatusDto;
}
