import { ApiProperty } from '@nestjs/swagger';

export class SetLightJobStatus {
  @ApiProperty()
  public isActive!: boolean;
}
