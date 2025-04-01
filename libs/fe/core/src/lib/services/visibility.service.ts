import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { RoutePath } from '../enum';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _router: Router = inject(Router);

  public listenToVisibilityChange(): void {
    this._document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this._router.navigate([RoutePath.MAIN]);
      }
    });
  }
}
