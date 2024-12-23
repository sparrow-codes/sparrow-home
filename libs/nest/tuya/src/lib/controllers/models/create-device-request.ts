import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDeviceRequest {
  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty({ required: true })
  public type!: number;

  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty({ required: true })
  public tuyaDeviceId!: string;

  @MaxLength(100)
  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty({ required: true })
  public name!: string;
}
