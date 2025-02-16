import { ApiProperty } from '@nestjs/swagger';

export class SetHeatingPreferencesRequest {
  @ApiProperty({ nullable: true })
  public firstFlorSensorId!: number | null;

  @ApiProperty({ nullable: true })
  public groundFlorSensorId!: number | null;

  @ApiProperty({ nullable: true })
  public minTargetTemperature!: number | null;

  @ApiProperty({ nullable: true })
  public maxTargetTemperature!: number | null;
}
