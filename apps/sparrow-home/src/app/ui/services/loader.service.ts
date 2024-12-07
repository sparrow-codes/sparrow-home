import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _overlayRef?: OverlayRef;
  private readonly _showLoader: WritableSignal<boolean> = signal(false);
  private readonly _loader: ComponentPortal<MatProgressSpinner> = new ComponentPortal(MatProgressSpinner);

  public set showLoader(value: boolean) {
    this._showLoader.set(value);
  }

  public constructor(private readonly _overlay: Overlay) {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
    });

    effect(() => {
      if (this._showLoader()) {
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
