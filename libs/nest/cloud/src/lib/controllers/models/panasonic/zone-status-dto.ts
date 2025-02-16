import { ApiProperty } from '@nestjs/swagger';

export class ZoneStatusDto {
  @ApiProperty()
  public operationStatus!: number;

  @ApiProperty({ nullable: true })
  public temparatureNow?: number;

  @ApiProperty()
  public heatSet!: number;
}
