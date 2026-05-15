import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { RoutePath } from '../enum';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _router: Router = inject(Router);
  private readonly _isVisible: Subject<boolean> = new Subject<boolean>();

  private _lastUserActivityAt: number = Date.now();
  private static readonly _FIFTEEN_MINUTES: number = 15 * 60 * 1000;

  public readonly isVisible: Observable<boolean> = this._isVisible.asObservable();

  public listenToVisibilityChange(): void {
    this._document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this._isVisible.next(true);

        const wasRecentlyActive: boolean = Date.now() - this._lastUserActivityAt < VisibilityService._FIFTEEN_MINUTES;

        if (wasRecentlyActive) {
          return;
        }

        this._router.navigate([RoutePath.MAIN]);
      }
    });

    ['click', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
      this._document.addEventListener(
        eventName,
        () => {
          this._lastUserActivityAt = Date.now();
        },
        { passive: true }
      );
    });
  }
}
