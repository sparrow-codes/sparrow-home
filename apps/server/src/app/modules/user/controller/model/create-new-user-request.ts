import { IsNotEmpty } from 'class-validator';

import { UserRole } from '../../enum/user-role';

export class CreateNewUserRequest {
  @IsNotEmpty()
  public firstName: string;
  @IsNotEmpty()
  public password: string;
  @IsNotEmpty()
  public role: UserRole;

  public lastName?: string;
  public email?: string;
}
