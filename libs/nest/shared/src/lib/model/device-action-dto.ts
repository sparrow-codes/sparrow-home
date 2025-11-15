import { ApiProperty } from '@nestjs/swagger';

export class DeviceActionDto {
  @ApiProperty()
  public key!: string;

  @ApiProperty({ enum: ['boolean', 'number', 'enum', 'unknown'] })
  public type!: 'boolean' | 'number' | 'enum' | 'unknown';

  @ApiProperty({ nullable: true })
  public enumValues?: string[];
  @ApiProperty({ nullable: true })
  public unit?: string;
  @ApiProperty({ nullable: true })
  public range?: { min?: number; max?: number };
  @ApiProperty({ nullable: true })
  public currentValue?: unknown;
}
