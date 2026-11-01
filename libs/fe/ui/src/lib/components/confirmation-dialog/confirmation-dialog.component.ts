import { Component, inject } from '@angular/core';
import { IonButton, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

import { Divider } from '../divider/divider';

@Component({
  selector: 'sp-confirmation-dialog',
  imports: [TranslatePipe, IonButton, Divider],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  public readonly content: string = '';

  private readonly _modalController: ModalController = inject(ModalController);

  protected async onConfirm(): Promise<void> {
    await this._modalController.dismiss(true);
  }

  protected async onCancel(): Promise<void> {
    await this._modalController.dismiss(false);
  }
}
