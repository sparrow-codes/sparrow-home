import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { ConfirmationDialogData } from './model/confirmation-dialog-data';

@Component({
  selector: 'sp-confirmation-dialog',
  imports: [CommonModule, MatDialogContent, MatDialogTitle, MatDialogActions, MatButton, MatDialogClose],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  protected readonly data: ConfirmationDialogData = inject(MAT_DIALOG_DATA);

  private readonly _matDialogRef: MatDialogRef<ConfirmationDialogData> = inject(MatDialogRef);

  protected onConfirm(): void {
    this._matDialogRef.close(true);
  }
}
