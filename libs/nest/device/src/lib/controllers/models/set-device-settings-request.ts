import { ApiProperty } from '@nestjs/swagger';

export class SetDeviceSettingsRequest {
  @ApiProperty({ nullable: true })
  public mainActionKey: string | null = null;
  @ApiProperty({ nullable: true })
  public mainParamKey: string | null = null;
  @ApiProperty({ nullable: true })
  public isOnMainPage?: boolean;
}
