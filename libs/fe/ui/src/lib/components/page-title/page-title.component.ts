import { Component, input, InputSignal } from '@angular/core';
import { IonProgressBar } from '@ionic/angular';

import { BackButton } from '../back-button/back-button';

@Component({
  selector: 'sp-page-title',
  templateUrl: './page-title.component.html',
  imports: [BackButton, IonProgressBar],
})
export class PageTitleComponent {
  public readonly title: InputSignal<string> = input('');
  public readonly subtitle: InputSignal<string> = input('');
  public readonly showBackButton: InputSignal<boolean> = input(false);
  public readonly backButtonDisabled: InputSignal<boolean> = input(false);
}
