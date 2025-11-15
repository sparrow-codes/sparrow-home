import { ApiProperty } from '@nestjs/swagger';

export class GetAllDeviceFilters {
  @ApiProperty({ required: false, nullable: true })
  public deviceType?: number;

  @ApiProperty()
  @ApiProperty({ required: false, nullable: true })
  public isOpen?: boolean;
}
