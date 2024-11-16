import { FormControl } from '@angular/forms';

import { HeatTankFormName } from '../enum/heat-tank-form-name';

export interface HeatTankForm {
  [HeatTankFormName.HEAT_OVER_NIGHT]: FormControl<boolean>;
}
