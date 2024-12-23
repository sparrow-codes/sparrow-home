import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNewUserRequest {
  @IsNotEmpty()
  @ApiProperty()
  public firstName!: string;
  @IsNotEmpty()
  @ApiProperty()
  public password!: string;
  @IsNotEmpty()
  @ApiProperty()
  public email!: string;

  @ApiProperty({ nullable: true })
  public lastName?: string;
}
