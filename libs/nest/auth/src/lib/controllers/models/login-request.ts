import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @ApiProperty()
  public email!: string;

  @IsNotEmpty()
  @ApiProperty()
  public password!: string;
}
