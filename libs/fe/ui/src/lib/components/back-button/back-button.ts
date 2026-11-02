import { Component, input, InputSignal } from '@angular/core';
import { IonBackButton } from '@ionic/angular';

@Component({
  selector: 'sp-back-button',
  imports: [IonBackButton],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly defaultHref: InputSignal<string> = input('/');
}
