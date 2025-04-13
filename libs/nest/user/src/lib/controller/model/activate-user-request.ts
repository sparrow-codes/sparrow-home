import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActivateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  public userId!: number;
}
