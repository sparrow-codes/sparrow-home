import { FormControl } from '@angular/forms';

import { CreateUserFormName } from '../enum/create-user-form.name';

export interface CreateNewUserForm {
  [CreateUserFormName.FIRST_NAME]: FormControl<string>;
  [CreateUserFormName.EMAIL]: FormControl<string>;
  [CreateUserFormName.LAST_NAME]: FormControl<string>;
  [CreateUserFormName.PASSWORD]: FormControl<string>;
  [CreateUserFormName.REPEAT_PASSWORD]: FormControl<string>;
}
