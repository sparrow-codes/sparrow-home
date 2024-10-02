import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;
}
