import { FormControl } from '@angular/forms';

import { CircularPumpSettingFormName } from '../enum/circular-pump-setting-form-name';

export interface CircularPumpForm {
  [CircularPumpSettingFormName.HOME_DEVICE]: FormControl<string | null>;
  [CircularPumpSettingFormName.FROM]: FormControl<Date | null>;
  [CircularPumpSettingFormName.TO]: FormControl<Date | null>;
}
