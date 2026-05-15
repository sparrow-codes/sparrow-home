import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type Vt = 'auth' | 'sub' | null;

@Injectable({
  providedIn: 'root',
})
export class ViewTransitionDirectionService {
  private router = inject(Router);

  private lastVt: Vt = null;
  private lastModuleBase: string | null = null;
  private subStack: string[] = [];

  public init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((navigationEnd) => {
        const url: string = navigationEnd.urlAfterRedirects;

        const vt: Vt = this.deepestData(this.router.routerState.snapshot.root, 'vt') as Vt;
        const base: string | null = this.getModuleBase(url);

        const html: HTMLElement = document.documentElement;
        html.classList.remove('vt-auth', 'vt-sub-forward', 'vt-sub-back');

        if (this.lastVt === 'auth' && vt !== 'auth') {
          this.subStack = [];
          html.classList.add('vt-auth');
          this.lastVt = vt;
          this.lastModuleBase = base;
          return;
        }

        if (vt === 'sub') {
          const prevIndex: number = this.subStack.lastIndexOf(url);
          const isBack: boolean = prevIndex !== -1 && prevIndex < this.subStack.length - 1;

          html.classList.add(isBack ? 'vt-sub-back' : 'vt-sub-forward');

          if (isBack) this.subStack = this.subStack.slice(0, prevIndex + 1);
          else this.subStack.push(url);

          this.lastVt = vt;
          this.lastModuleBase = base;
          return;
        }

        if (this.lastVt === 'sub' && base && base === this.lastModuleBase) {
          html.classList.add('vt-sub-back');
          this.subStack = [];
          this.lastVt = vt;
          this.lastModuleBase = base;
          return;
        }

        this.subStack = [];
        this.lastVt = vt;
        this.lastModuleBase = base;
      });
  }

  private deepestData(snapshot: ActivatedRouteSnapshot, key: string): unknown {
    let cur: ActivatedRouteSnapshot | null = snapshot;
    let value: unknown = null;
    while (cur) {
      if (cur.data && key in cur.data) value = cur.data[key];
      cur = cur.firstChild ?? null;
    }
    return value;
  }

  private getModuleBase(url: string): string | null {
    const clean: string = url.split('?')[0].split('#')[0];
    const seg: string[] = clean.split('/').filter(Boolean);
    return seg[0] ?? null;
  }
}
