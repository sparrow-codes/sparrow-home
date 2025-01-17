import { ApiProperty } from '@nestjs/swagger';

export class GetCircularPumpPreferences {
  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty()
  public homeDeviceId?: string;

  @ApiProperty()
  public circularPumpStartTime?: Date;

  @ApiProperty()
  public circularPumpEndTime?: Date;
}
