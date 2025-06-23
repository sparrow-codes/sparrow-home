import { FormControl } from '@angular/forms';

import { ScheduleFormName } from '../enum/schedule-form-name';

export interface ScheduleForm {
  [ScheduleFormName.HOME_DEVICE]: FormControl<string | null>;
  [ScheduleFormName.FROM]: FormControl<Date | null>;
  [ScheduleFormName.TO]: FormControl<Date | null>;
}
