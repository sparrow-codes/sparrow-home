import { ApiProperty } from '@nestjs/swagger';

export class GetHeatingPreferencesResponse {
  @ApiProperty()
  public isAutomaticHeat!: boolean;

  @ApiProperty({ nullable: true })
  public groundFlorTemperatureSensorId?: number;

  @ApiProperty({ nullable: true })
  public firstFlorTemperatureSensorId?: number;

  @ApiProperty({ nullable: true })
  public minTargetTemperature?: number;

  @ApiProperty({ nullable: true })
  public maxTargetTemperature?: number;
}
