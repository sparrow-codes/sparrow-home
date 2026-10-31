import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonSpinner } from '@ionic/angular';

@Component({
  selector: 'sp-spinner',
  imports: [CommonModule, IonSpinner],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {}
