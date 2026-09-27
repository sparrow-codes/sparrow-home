import { ApiProperty } from '@nestjs/swagger';

export class GetVacationModeResponse {
  @ApiProperty({ type: Boolean })
  public isVacationMode!: boolean;
}