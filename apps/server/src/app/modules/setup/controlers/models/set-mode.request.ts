import { IsNotEmpty } from 'class-validator';

import { Mode } from '../../../../enums/mode';

export class SetModeRequest {
  @IsNotEmpty()
  public mode: Mode;
}
