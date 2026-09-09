import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

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

  @ApiProperty({ nullable: false, required: true, default: false, type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  public runOnVacation: boolean = false;
}
