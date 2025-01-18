import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetPluginSwitchStatusRequest {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  public isOn!: boolean;
}
