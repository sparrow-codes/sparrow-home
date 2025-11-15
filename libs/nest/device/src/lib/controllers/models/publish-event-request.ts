import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PublishEventRequest {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Device Id is required' })
  public deviceId!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Payload is required' })
  public payload!: Record<string, unknown>;
}
