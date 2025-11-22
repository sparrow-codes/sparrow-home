import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceMainFieldsRequest {
  @ApiProperty({ nullable: true })
  public mainActionKey: string | null = null;
  @ApiProperty({ nullable: true })
  public mainParamKey: string | null = null;
}
