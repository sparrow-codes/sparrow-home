import { ApiProperty } from '@nestjs/swagger';

export class GetAllDeviceFilters {
  @ApiProperty({ required: false, nullable: true })
  public deviceType?: number;

  @ApiProperty({ required: false, nullable: true })
  public isOpen?: boolean;

  @ApiProperty({ required: false, nullable: true })
  public isOnMainPage?: boolean;
}
