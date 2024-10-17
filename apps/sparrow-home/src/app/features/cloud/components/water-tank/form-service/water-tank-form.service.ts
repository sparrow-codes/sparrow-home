import { Injectable } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { WaterTankFormName } from './enum/water-tank-form-name';
import { WaterTankForm } from './model/water-tank-form';

@Injectable()
export class WaterTankFormService {
  private readonly _form: FormGroup<WaterTankForm>;

  public get form(): FormGroup<WaterTankForm> {
    return this._form;
  }

  public get scheduleWaterHeatingControl(): FormControl<boolean> {
    return this._form.get(WaterTankFormName.SCHEDULE_WATER_HEATING) as FormControl<boolean>;
  }

  public constructor(private readonly _fb: NonNullableFormBuilder) {
    this._form = this._fb.group({
      [WaterTankFormName.SCHEDULE_WATER_HEATING]: this._fb.control(false),
    });
  }
}
