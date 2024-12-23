import { ApiProperty } from '@nestjs/swagger';

export class GetSetupResponse {
  @ApiProperty()
  public lat?: number;

  @ApiProperty()
  public lng?: number;
}
