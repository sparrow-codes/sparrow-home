import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'sp-spinner',
  imports: [CommonModule, MatProgressSpinner],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {}
