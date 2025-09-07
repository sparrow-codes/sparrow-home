import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetAlarmModeResponse {
  @ApiProperty()
  @IsNotEmpty()
  public isActive!: boolean;

  @ApiProperty()
  @IsNotEmpty()
  public isAvailable!: boolean;
}
