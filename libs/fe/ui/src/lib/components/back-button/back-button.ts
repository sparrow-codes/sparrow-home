import { Component, inject, input, InputSignal } from '@angular/core';
import { IonButton, IonIcon, NavController } from '@ionic/angular';

@Component({
  selector: 'sp-back-button',
  imports: [IonButton, IonIcon],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  private readonly navController = inject(NavController);

  public readonly disabled: InputSignal<boolean> = input(false);

  protected goBack(): void {
    if (this.disabled()) {
      return;
    }

    this.navController.back();
  }
}
