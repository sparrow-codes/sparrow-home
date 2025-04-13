import { ApiProperty } from '@nestjs/swagger';

export class AdditionalUserDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public firstName!: string;

  @ApiProperty()
  public isActive!: boolean;

  @ApiProperty()
  public lastName?: string;
}
