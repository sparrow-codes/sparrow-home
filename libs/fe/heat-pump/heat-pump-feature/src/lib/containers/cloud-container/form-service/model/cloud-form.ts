import { FormControl } from '@angular/forms';

import { CloudFormName } from '../enum/cloud-form-name';

export interface CloudForm {
  [CloudFormName.IS_WATER_ON]: FormControl<boolean>;
  [CloudFormName.IS_HEAT_ON]: FormControl<boolean>;
}
