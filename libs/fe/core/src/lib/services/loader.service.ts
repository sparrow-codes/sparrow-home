import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, Observable } from 'rxjs';

import { SpinnerComponent } from '../components/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _overlayRef?: OverlayRef;
  private readonly _showLoader: WritableSignal<boolean> = signal(false);
  private readonly _loader: ComponentPortal<SpinnerComponent> = new ComponentPortal(SpinnerComponent);
  private readonly _showLoader$: Observable<boolean> = toObservable(this._showLoader);

  public set showLoader(value: boolean) {
    this._showLoader.set(value);
  }

  public constructor(private readonly _overlay: Overlay) {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically().left('250px'),
    });

    this._showLoader$.pipe(takeUntilDestroyed(), debounceTime(500)).subscribe((showLoader) => {
      if (showLoader) {
        this._overlayRef = this._overlay.create({
          hasBackdrop: true,
          positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
        });
        this._overlayRef.attach(this._loader);
      } else {
        this._overlayRef?.detach();
      }
    });
  }
}
