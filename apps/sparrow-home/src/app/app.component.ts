import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, MatSnackBarModule, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
