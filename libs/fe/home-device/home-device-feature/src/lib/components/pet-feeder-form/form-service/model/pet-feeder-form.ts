import { FormControl } from '@angular/forms';

export interface PetFeederForm {
  numberOfPortions: FormControl<number>;
  portionSize: FormControl<number>;
}
