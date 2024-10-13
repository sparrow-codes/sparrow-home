import { IsNotEmpty } from 'class-validator';

export class SetHeatPumpStatusRequest {
  @IsNotEmpty()
  public isWaterOn: boolean;

  @IsNotEmpty()
  public isHeatOn: boolean;

  @IsNotEmpty()
  public deviceGuid: string;
}
