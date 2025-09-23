import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class SetPetFeederConfig {
  @ApiProperty({ minimum: 1, maximum: 10, nullable: false })
  @Min(1, { message: 'Field must be greater than 0' })
  @Max(10, { message: 'Field must be less than 10' })
  @IsNotEmpty({ message: 'Portions is required' })
  public numberOfPortions!: number;

  @ApiProperty({ minimum: 1, maximum: 20, nullable: false })
  @IsNotEmpty({ message: 'Field is required' })
  @Min(1, { message: 'Field must be greater than 0' })
  @Max(20, { message: 'Field must be less than 20' })
  public portionSize!: number;
}
