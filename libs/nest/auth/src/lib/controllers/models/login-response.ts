import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  public token!: string;
}
