import { FormControl } from '@angular/forms';

import { HeatingSettingsFormName } from '../enum/heating-settings-form.enum';

export interface HeatingSettingsForm {
  [HeatingSettingsFormName.GROUND_FLOR_SENSOR_ID]: FormControl<number | null>;
  [HeatingSettingsFormName.FIRST_FLOR_SENSOR_ID]: FormControl<number | null>;
  [HeatingSettingsFormName.MAXIMUM_TEMPERATURE]: FormControl<number | null>;
  [HeatingSettingsFormName.MINIMUM_TEMPERATURE]: FormControl<number | null>;
}
