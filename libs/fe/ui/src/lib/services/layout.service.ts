import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private static readonly _MOBILE_WIDTH: string = '768px';
  private readonly _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  public readonly isMobile: Signal<boolean> = toSignal(
    this._breakpointObserver
      .observe(`(max-width: ${LayoutService._MOBILE_WIDTH})`)
      .pipe(map((status) => status.matches)),
    { initialValue: false }
  );
}
