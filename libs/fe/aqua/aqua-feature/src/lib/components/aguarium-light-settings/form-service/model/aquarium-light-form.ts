import { FormControl } from '@angular/forms';

import { AquariumLightFormName } from '../enum/aquarium-light-form-name';

export interface AquariumLightForm {
  [AquariumLightFormName.TUYA_DEVICE]: FormControl<string | null>;
  [AquariumLightFormName.FROM]: FormControl<Date | null>;
  [AquariumLightFormName.TO]: FormControl<Date | null>;
}
