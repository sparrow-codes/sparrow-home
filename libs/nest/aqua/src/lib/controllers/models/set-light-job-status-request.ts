import { ApiProperty } from '@nestjs/swagger';

export class SetLightJobStatusRequest {
  @ApiProperty()
  public isActive!: boolean;
}
