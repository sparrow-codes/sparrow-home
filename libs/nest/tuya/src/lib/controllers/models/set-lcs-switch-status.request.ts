import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetLcsSwitchStatusRequest {
  @ApiProperty({required: true})
  @IsNotEmpty()
  public isOn!: boolean;
}
