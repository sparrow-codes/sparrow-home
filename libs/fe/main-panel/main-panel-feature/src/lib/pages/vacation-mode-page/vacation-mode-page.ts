import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonToggle,
  IonToolbar,
} from '@ionic/angular';
import { bootstrapChevronRight, bootstrapPlayCircle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MainPanelStore, mainPanelStore } from '@sparrow-home/main-panel-domain';
import { Divider, PageTitleComponent } from '@sparrow-home/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'sp-vacation-mode-page',
  imports: [
    PageTitleComponent,
    TranslatePipe,
    AsyncPipe,
    NgIconComponent,
    Divider,
    IonToggle,
    RouterLink,
    IonBadge,
    IonIcon,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonHeader,
    IonToolbar,
    Divider,
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
