import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'sp-new-version-dialog',
  imports: [CommonModule, ButtonDirective],
  templateUrl: './new-version-dialog.component.html',
})
export class NewVersionDialogComponent {
  protected readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
}
