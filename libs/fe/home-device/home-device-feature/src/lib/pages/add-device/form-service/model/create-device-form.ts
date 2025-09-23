import { FormControl } from '@angular/forms';

export interface CreateDeviceForm {
  deviceType: FormControl<number | null>;
  name: FormControl<string>;
}
