import { Mode } from '../../../../enums/mode';

export class GetSetupResponse {
  public currentMode: Mode;
  public dictionaries: {
    modeDictionary: { value: Mode; label: string }[];
  };
}
