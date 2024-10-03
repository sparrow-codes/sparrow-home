import { IsNotEmpty } from 'class-validator';

export class CreateNewUserRequest {
  @IsNotEmpty()
  public firstName: string;
  @IsNotEmpty()
  public password: string;
  @IsNotEmpty()
  public email: string;

  public lastName?: string;
}
