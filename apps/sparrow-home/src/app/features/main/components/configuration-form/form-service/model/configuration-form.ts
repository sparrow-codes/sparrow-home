import { FormControl } from '@angular/forms';

import { ConfigurationFormName } from '../enum/configuration-form-name';

export interface ConfigurationForm {
  [ConfigurationFormName.LAT]: FormControl<number | null>;
  [ConfigurationFormName.LNG]: FormControl<number | null>;
}
