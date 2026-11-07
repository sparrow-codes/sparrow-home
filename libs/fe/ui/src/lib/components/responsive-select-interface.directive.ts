import { BreakpointObserver } from '@angular/cdk/layout';
import { Directive, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type SelectInterface = 'action-sheet' | 'popover';

@Directive({
  // This element selector intentionally applies responsive behavior to every ion-select.
  // eslint-disable-next-line @angular-eslint/directive-selector -- Global ion-select behavior is intentional.
  selector: 'ion-select',
  host: {
    '[attr.interface]': 'selectInterface()',
  },
})
export class ResponsiveSelectInterfaceDirective {
  protected readonly selectInterface = signal<SelectInterface>('action-sheet');

  private readonly _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  public constructor() {
    this._breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => this.selectInterface.set(matches ? 'popover' : 'action-sheet'));
  }
}
