import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PetFeeder } from '@sparrow-home/home-device-domain';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Slider } from 'primeng/slider';

import { PetFeederForm } from './form-service/model/pet-feeder-form';
import { PetFeederFormService } from './form-service/pet-feeder-form.service';

@Component({
  selector: 'sp-pet-feeder-form',
  imports: [CommonModule, Slider, ReactiveFormsModule, Button],
  templateUrl: './pet-feeder-form.component.html',
  providers: [PetFeederFormService],
})
export class PetFeederFormComponent implements OnInit {
  private readonly _formService: PetFeederFormService = inject(PetFeederFormService);
  private readonly _dialog: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly _petFeeder: PetFeeder = inject(DynamicDialogConfig).data;

  protected readonly formGroup: FormGroup<PetFeederForm> = this._formService.form;

  public ngOnInit(): void {
    this._formService.patchForm(this._petFeeder);
  }

  protected onSubmit(): void {
    this._dialog.close(this.formGroup.value);
  }

  protected onCancel(): void {
    this._dialog.close();
  }
}
