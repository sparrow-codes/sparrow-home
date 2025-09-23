import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { PetFeeder } from '@sparrow-home/home-device-domain';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, first } from 'rxjs';

import { PetFeederFormComponent } from '../pet-feeder-form/pet-feeder-form.component';

@Component({
  selector: 'sp-pet-feeder-details',
  imports: [CommonModule, Button],
  templateUrl: './pet-feeder-details.component.html',
})
export class PetFeederDetailsComponent {
  public readonly petFeeder: InputSignal<PetFeeder> = input.required();
  public updatePetFeederConfig: OutputEmitterRef<PetFeeder> = output();

  private readonly _dialogService: DialogService = inject(DialogService);

  protected openEditForm(): void {
    this._dialogService
      .open(PetFeederFormComponent, {
        data: this.petFeeder(),
        header: 'Ustawienia',
        width: '90vw',
      })
      .onClose.pipe(
        first(),
        filter((value) => !!value)
      )
      .subscribe((value) => this.updatePetFeederConfig.emit({ ...this.petFeeder(), ...value }));
  }
}
