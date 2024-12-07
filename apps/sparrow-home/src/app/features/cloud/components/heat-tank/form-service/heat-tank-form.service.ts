import { Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { HeatTankFormName } from './enum/heat-tank-form-name';
import { HeatTankForm } from './model/heat-tank-form';

@Injectable()
export class HeatTankFormService {
  private readonly _form: FormGroup<HeatTankForm>;

  public get form(): FormGroup<HeatTankForm> {
    return this._form;
  }

  public get heatOverNightControl(): FormControl<boolean> {
    return this._form.get(HeatTankFormName.HEAT_OVER_NIGHT) as FormControl<boolean>;
  }

  public constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this._form = this.formBuilder.group({
      [HeatTankFormName.HEAT_OVER_NIGHT]: this.formBuilder.control<boolean>(false),
    });
  }
}
