import { ApiProperty } from '@nestjs/swagger';

export class SetVacationModeRequest {
  @ApiProperty({ type: Boolean })
  public isVacationMode!: boolean;
}