import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ nullable: false })
  public token!: string;
}
