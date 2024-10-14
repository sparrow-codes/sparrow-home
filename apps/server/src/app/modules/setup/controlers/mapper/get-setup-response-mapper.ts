import { ModeDictionary } from '../../dictionaries/mode-dictionary';
import { Setup } from '../../enitites/setup';
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
