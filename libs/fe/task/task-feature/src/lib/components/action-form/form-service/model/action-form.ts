import { FormControl } from '@angular/forms';

export interface ActionForm {
  device: FormControl<string | null>;
  action: FormControl<string | null>;
  payload: FormControl<Record<string, unknown> | null>;
  time: FormControl<Date>;
}
