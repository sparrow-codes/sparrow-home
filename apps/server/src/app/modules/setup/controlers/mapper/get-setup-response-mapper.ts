import { Setup } from '../../../../entities/setup';
import { ModeDictionary } from '../../dictionaries/mode-dictionary';
import { GetSetupResponse } from '../models/get-setup.response';

export class GetSetupResponseMapper {
  public static map(setup: Setup): GetSetupResponse {
    return {
      currentMode: setup.mode,
      lat: setup.lat,
      lng: setup.lng,
      marginTemperatureOverNight: setup.marginTemperatureOverNight,
      dictionaries: {
        modeDictionary: ModeDictionary,
      },
    };
  }
}
