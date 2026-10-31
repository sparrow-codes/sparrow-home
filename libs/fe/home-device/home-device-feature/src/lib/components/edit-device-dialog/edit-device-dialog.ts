import { Component, inject, input, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonInput, IonLabel, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Divider } from '@sparrow-home/ui';

@Component({
  selector: 'sp-edit-device-dialog',
  imports: [IonButton, Divider, IonLabel, TranslatePipe, FormsModule, IonInput],
  templateUrl: './edit-device-dialog.html',
  styleUrl: './edit-device-dialog.css',
})
export class EditDeviceDialog {
  public readonly deviceName: string = '';

  private readonly _modalController: ModalController = inject(ModalController);

  protected newName?: string;

  protected async closeDialog(): Promise<void> {
    await this._modalController.dismiss();
  }

  protected async nameChanged(): Promise<void> {
    if (this.newName?.trim() === this.deviceName) {
      return;
    }

    await this._modalController.dismiss(this.newName);
  }
}
