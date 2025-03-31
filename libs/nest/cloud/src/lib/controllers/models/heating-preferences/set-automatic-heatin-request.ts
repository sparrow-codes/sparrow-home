import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetAutomaticHeatingRequest {
  @ApiProperty({nullable: false})
  @IsNotEmpty()
  public isAutomaticHeating!: boolean;
}
