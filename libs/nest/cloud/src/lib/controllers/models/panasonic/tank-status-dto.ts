import { ApiProperty } from '@nestjs/swagger';

export class TankStatusDto {
  @ApiProperty()
  public operationStatus!: number;

  @ApiProperty()
  public temparatureNow!: number;

  @ApiProperty()
  public heatMax!: number;

  @ApiProperty()
  public heatMin!: number;

  @ApiProperty()
  public heatSet!: number;
}
