import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetHeatingPreferencesRequest {
  @IsNotEmpty()
  @ApiProperty()
  public firstFlorSensorId?: number;

  @IsNotEmpty()
  @ApiProperty()
  public groundFlorSensorId?: number;

  @IsNotEmpty()
  @ApiProperty()
  public minTargetTemperature?: number;

  @IsNotEmpty()
  @ApiProperty()
  public maxTargetTemperature?: number;
}
