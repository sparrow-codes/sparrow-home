import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeDeviceNameRequest {
  @ApiProperty({ nullable: false, required: true })
  @IsNotEmpty()
  public id!: number;

  @ApiProperty({ nullable: false, required: true })
  @IsNotEmpty()
  public deviceName!: string;
}
