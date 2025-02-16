import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SetAquaPreferences {
  @ApiProperty({ required: false })
  public homeDeviceId?: string;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public from?: Date;

  @ApiProperty({ required: false, type: Date })
  @Type(() => Date)
  public to?: Date;
}
