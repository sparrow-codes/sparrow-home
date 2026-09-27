import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { bootstrapChevronRight, bootstrapPlayCircle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MainPanelStore, mainPanelStore } from '@sparrow-home/main-panel-domain';
import { PageTitleComponent } from '@sparrow-home/ui';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Observable } from 'rxjs';

@Component({
  selector: 'sp-vacation-mode-page',
  imports: [
    PageTitleComponent,
    TranslatePipe,
    AsyncPipe,
    Card,
    NgIconComponent,
    Divider,
    ToggleSwitch,
    RouterLink,
    Tag,
    FormsModule,
  ],
  providers: [provideIcons({ bootstrapChevronRight, bootstrapPlayCircle })],
  templateUrl: './vacation-mode-page.html',
})
export class VacationModePage {
  private readonly _store: MainPanelStore = inject(mainPanelStore);

  protected readonly isRefreshing$: Observable<boolean> = this._store.isRefreshing$;
  protected readonly isVacationMode: Signal<boolean> = this._store.isVacationMode;

  protected updateVacationMode(value: boolean): void {
    this._store.setVacationMode(value);
  }
}
