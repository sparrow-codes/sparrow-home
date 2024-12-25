import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public email!: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public password!: string;
}
