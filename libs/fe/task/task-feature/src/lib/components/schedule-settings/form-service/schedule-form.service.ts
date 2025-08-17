import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AutomaticTask } from '@sparrow-home/task-domain';

import { ScheduleForm } from './model/schedule-form';

@Injectable()
export class ScheduleFormService {
  private _form: FormGroup<ScheduleForm> | null = null;

  private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get form(): FormGroup<ScheduleForm> | null {
    return this._form;
  }

  public initForm(task?: Partial<AutomaticTask>): void {
    this._form = this._fb.group({
      devices: this._fb.control(new Array<number>()),
      from: this._fb.control(task?.startTime ?? null),
      to: this._fb.control(task?.endTime ?? null),
      name: this._fb.control(task?.name ?? '', { validators: [Validators.required] }),
    });
  }
}
