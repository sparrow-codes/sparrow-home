import { FormControl } from '@angular/forms';

export interface ScheduleForm {
  name: FormControl<string>;
  daysOfWeek: FormControl<number[] | null>;
}
