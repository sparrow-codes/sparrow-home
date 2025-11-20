import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActionJobDto {
  @ApiProperty({ nullable: false, required: true })
  @IsNotEmpty()
  public assignedDeviceId!: string;

  @ApiProperty({ nullable: false, required: true })
  @IsNotEmpty()
  public payload!: Record<string, unknown>;

  @ApiProperty({ nullable: true, isArray: true, type: 'number' })
  @IsNotEmpty()
  public daysOfTheWeek!: number[] | null;

  @ApiProperty({ nullable: false, required: true })
  @IsNotEmpty()
  public executionTime!: Date;
}
