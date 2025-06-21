import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'sp-spinner',
  imports: [CommonModule, ProgressSpinner],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {}
