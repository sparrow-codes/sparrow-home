import { ApiProperty } from '@nestjs/swagger';

export class GetAquaPreferences {
  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty()
  public tuyaDeviceId?: string;

  @ApiProperty()
  public lightStartTime?: Date;

  @ApiProperty()
  public lightEndTime?: Date;
}
