import { ApiProperty } from '@nestjs/swagger';

export class GetUserDetailsResponse {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public firstName!: string;

  @ApiProperty()
  public email!: string;

  @ApiProperty({ nullable: true })
  public lastName?: string;

  @ApiProperty()
  public role!: number;
}
