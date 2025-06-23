import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ConfirmationDialogData } from './model/confirmation-dialog-data';

@Component({
  selector: 'sp-confirmation-dialog',
  imports: [CommonModule, ButtonDirective],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  protected readonly data: ConfirmationDialogData = inject(DynamicDialogConfig).data;
  protected readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
