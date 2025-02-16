import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetHeatPumpStatusRequest {
  @IsNotEmpty()
  @ApiProperty()
  public isWaterOn!: boolean;

  @IsNotEmpty()
  @ApiProperty()
  public isHeatOn!: boolean;

  @IsNotEmpty()
  @ApiProperty()
  public deviceGuid!: string;
}
