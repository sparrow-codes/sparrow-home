import { FormControl } from '@angular/forms';

import { ConfigurationFormName } from '../enum/configuration-form-name';

export interface ConfigurationForm {
  [ConfigurationFormName.LAT]: FormControl<number | null>;
  [ConfigurationFormName.LNG]: FormControl<number | null>;
  [ConfigurationFormName.MARGIN_TEMPERATURE_OVER_NIGHT]: FormControl<number | null>;
}
