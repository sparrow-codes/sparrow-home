import { ApiProperty } from '@nestjs/swagger';

export class SetConfigurationRequest {
  @ApiProperty()
  public lat?: number;
  @ApiProperty()
  public lng?: number;
}
