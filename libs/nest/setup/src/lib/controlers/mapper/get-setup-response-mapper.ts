import { Setup } from '@sparrow-server/entities';

import { GetSetupResponse } from '../models/get-setup.response';

export class GetSetupResponseMapper {
  public static map(setup: Setup): GetSetupResponse {
    return {
      lat: setup.lat,
      lng: setup.lng,
    };
  }
}
