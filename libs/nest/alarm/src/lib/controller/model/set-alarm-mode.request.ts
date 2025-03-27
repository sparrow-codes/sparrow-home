import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetAlarmModeRequest {
  @IsNotEmpty()
  @ApiProperty()
  public isActive!: boolean;
}
