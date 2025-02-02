import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlarmFacadeDataService } from '@sparrow-home/alarm-domain';
import { PageTitleComponent, sparrowFadeIn } from '@sparrow-home/ui';
import { skip } from 'rxjs';

import { SosComponent } from '../../component/sos/sos.component';

@Component({
  imports: [CommonModule, PageTitleComponent, MatCard, MatCardHeader, MatButton, MatCardTitle],
  templateUrl: './alarm-page.component.html',
  animations: [sparrowFadeIn],
})
export class AlarmPageComponent {
  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _facadeService: AlarmFacadeDataService = inject(AlarmFacadeDataService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected openSosDialog(): void {
    const dialogRef: MatDialogRef<SosComponent> = this._matDialog.open(SosComponent, {
      disableClose: true,
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
    });

    dialogRef.componentInstance.isOnEvent
      .pipe(takeUntilDestroyed(this._destroyRef), skip(1))
      .subscribe((isOn) => this._facadeService.setAlarm(isOn));
  }
}
