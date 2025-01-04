import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SetCircularPumpPreferencesRequest {
  @ApiProperty({ required: false })
  public tuyaDeviceId?: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  public from?: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  public to?: Date;
}
