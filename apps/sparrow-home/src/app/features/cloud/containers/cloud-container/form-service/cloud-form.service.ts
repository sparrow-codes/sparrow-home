import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { CloudFormName } from './enum/cloud-form-name';
import { CloudForm } from './model/cloud-form';

@Injectable({
  providedIn: 'root',
})
export class CloudFormService {
  private _form?: FormGroup<CloudForm>;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<CloudForm> | undefined {
    return this._form;
  }

  public prepareForm(isWaterOn: boolean, isHeatOn: boolean): void {
    this._form = this._fb.group<CloudForm>({
      [CloudFormName.IS_WATER_ON]: this._fb.control<boolean>(isWaterOn),
      [CloudFormName.IS_HEAT_ON]: this._fb.control<boolean>(isHeatOn),
    });
  }
}
