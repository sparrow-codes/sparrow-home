import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';

import { Configuration } from '~core/models/configuration';

import { ConfigurationFormName } from './enum/configuration-form-name';
import { ConfigurationForm } from './model/configuration-form';

@Injectable()
export class ConfigurationFormService {
  private _form?: FormGroup<ConfigurationForm>;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<ConfigurationForm> | undefined {
    return this._form;
  }

  public prepareForm(configuration: Configuration): void {
    this._form = this._fb.group<ConfigurationForm>({
      [ConfigurationFormName.LNG]: this._fb.control(configuration.lng ?? null),
      [ConfigurationFormName.LAT]: this._fb.control(configuration.lat ?? null),
    });
  }

  public toConfiguration(configuration: Configuration): Configuration {
    return {
      ...configuration,
      lat: this._form?.value.lat ? Number(this._form?.value.lat) : undefined,
      lng: this._form?.value.lng ? Number(this._form?.value.lng) : undefined,
    };
  }
}
