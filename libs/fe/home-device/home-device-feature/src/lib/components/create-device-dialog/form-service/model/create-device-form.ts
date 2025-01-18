import { FormControl } from '@angular/forms';

import { CreateDeviceFormName } from '../enum/create-device-form-name';

export interface CreateDeviceForm {
  [CreateDeviceFormName.DEVICE_TYPE]: FormControl<number | null>;
  [CreateDeviceFormName.NAME]: FormControl<string>;
  [CreateDeviceFormName.HOME_DEVICE_ID]: FormControl<string>;
}
