import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetCircularPumpJobStatusRequest {
  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  public isActive!: boolean;
}
