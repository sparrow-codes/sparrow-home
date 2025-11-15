import { ApiProperty } from '@nestjs/swagger';

export class GetAllDoorAndWindowsStatus {
  @ApiProperty({ nullable: true })
  public areAllDoorsAndWindowsClosed: boolean | null = null;
}
