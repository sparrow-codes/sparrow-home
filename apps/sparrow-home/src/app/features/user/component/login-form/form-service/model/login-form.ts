import { FormControl } from '@angular/forms';

import { LoginFormName } from '../enum/loing-form-name';

export interface LoginForm {
  [LoginFormName.EMAIL]: FormControl<string>;
  [LoginFormName.PASSWORD]: FormControl<string>;
}
