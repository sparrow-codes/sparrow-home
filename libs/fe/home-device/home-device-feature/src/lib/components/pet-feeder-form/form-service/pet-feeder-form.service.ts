import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { PetFeeder } from '@sparrow-home/home-device-domain';

import { PetFeederForm } from './model/pet-feeder-form';

@Injectable()
export class PetFeederFormService {
  private readonly _form: FormGroup<PetFeederForm>;
  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<PetFeederForm> {
    return this._form;
  }

  public constructor() {
    this._form = this._fb.group<PetFeederForm>({
      numberOfPortions: this._fb.control<number>(0, { validators: [Validators.required] }),
      portionSize: this._fb.control<number>(0, { validators: [Validators.required] }),
    });
  }

  public patchForm(petFeeder: PetFeeder): void {
    this._form.patchValue({
      numberOfPortions: petFeeder.numberOfPortions,
      portionSize: petFeeder.portionSize,
    });
  }
}
