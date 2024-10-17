import { FormControl } from '@angular/forms';

import { WaterTankFormName } from '../enum/water-tank-form-name';

export interface WaterTankForm {
  [WaterTankFormName.SCHEDULE_WATER_HEATING]: FormControl<boolean>;
}
