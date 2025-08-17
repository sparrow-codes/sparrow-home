import { FormControl } from '@angular/forms';

export interface ScheduleForm {
  name: FormControl<string>;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
  devices: FormControl<number[]>;
}
