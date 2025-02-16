import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetAlarm {
  @IsNotEmpty({ message: 'Field is required' })
  @ApiProperty()
  public isOn!: boolean;
}
