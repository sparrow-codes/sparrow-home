import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, switchMap } from 'rxjs';

import { NewVersionDialogComponent } from '../components/new-version-dialog/new-version-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NewVersionService {
  private readonly _swUpdate: SwUpdate = inject(SwUpdate);
  private readonly _dialog: DialogService = inject(DialogService);
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public listenToNewVersionChange(): void {
    this._swUpdate.versionUpdates
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((eventType) => eventType.type === 'VERSION_READY'),
        switchMap(
          () =>
            this._dialog.open(NewVersionDialogComponent, {
              closable: false,
              header: 'Nowa wersja aplikacji',
            }).onClose
        )
      )
      .subscribe(() => this._document.location.reload());
  }
}
