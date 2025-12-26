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
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      const url = e.urlAfterRedirects;

      const vt: Vt = this.deepestData(this.router.routerState.snapshot.root, 'vt') as Vt;
      const base = this.getModuleBase(url);

      const html = document.documentElement;
      html.classList.remove('vt-auth', 'vt-sub-forward', 'vt-sub-back');

      // 1) AUTH -> SHELL: jeśli poprzednio byliśmy w auth i teraz już nie
      if (this.lastVt === 'auth' && vt !== 'auth') {
        this.subStack = [];
        html.classList.add('vt-auth');
        this.lastVt = vt;
        this.lastModuleBase = base;
        return;
      }

      // 2) SUB pages: push/pop w obrębie substacka
      if (vt === 'sub') {
        const prevIndex = this.subStack.lastIndexOf(url);
        const isBack = prevIndex !== -1 && prevIndex < this.subStack.length - 1;

        html.classList.add(isBack ? 'vt-sub-back' : 'vt-sub-forward');

        if (isBack) this.subStack = this.subStack.slice(0, prevIndex + 1);
        else this.subStack.push(url);

        this.lastVt = vt;
        this.lastModuleBase = base;
        return;
      }

      // 3) SUB -> MODULE ROOT w TYM SAMYM module: wymuś POP slide
      // Przykład: /devices/details/123 -> /devices
      if (this.lastVt === 'sub' && base && base === this.lastModuleBase) {
        html.classList.add('vt-sub-back');
        this.subStack = [];
        this.lastVt = vt;
        this.lastModuleBase = base;
        return;
      }

      // default: module switching = browser default fade (nie ustawiamy klas)
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

  // DOPASUJ do swojego układu: masz shell pod '', a moduły są childami:
  // /main, /devices, /automation, /user-profile
  private getModuleBase(url: string): string | null {
    const clean = url.split('?')[0].split('#')[0];
    const seg = clean.split('/').filter(Boolean);
    return seg[0] ?? null;
  }
}
