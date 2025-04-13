import { ApiProperty } from '@nestjs/swagger';

import { AdditionalUserDto } from '../../model/additional-user-dto';

export class GetListOfAdditionalUsersResponse {
  @ApiProperty({ isArray: true, type: AdditionalUserDto })
  public users!: AdditionalUserDto[];
}
