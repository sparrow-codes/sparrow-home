import { Mode } from '../../../../enums/mode';

export class GetSetupResponse {
  public currentMode: Mode;
  public lat: number;
  public lng: number;
  public dictionaries: {
    modeDictionary: { value: Mode; label: string }[];
  };
}
