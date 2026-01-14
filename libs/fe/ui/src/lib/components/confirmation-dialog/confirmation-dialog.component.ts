import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ConfirmationDialogData } from './model/confirmation-dialog-data';

@Component({
  selector: 'sp-confirmation-dialog',
  imports: [CommonModule, ButtonDirective, TranslatePipe],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  private readonly _domSanitizer: DomSanitizer = inject(DomSanitizer);

  protected readonly data: ConfirmationDialogData = inject(DynamicDialogConfig).data;
  protected readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected readonly content: SafeHtml = this._domSanitizer.bypassSecurityTrustHtml(this.data.content);

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
