import { FormControl } from '@angular/forms';

import { LoginFormName } from '~user/component/login-form/form-service/enum/loing-form-name';

export interface LoginForm {
  [LoginFormName.EMAIL]: FormControl<string>;
  [LoginFormName.PASSWORD]: FormControl<string>;
}
