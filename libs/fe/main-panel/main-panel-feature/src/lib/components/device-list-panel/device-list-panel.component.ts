import { ChangeDetectionStrategy,Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonItem, IonSkeletonText } from '@ionic/angular';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'sp-device-list-panel',
  imports: [RouterLink, TranslatePipe, IonSkeletonText, IonItem, NgIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './device-list-panel.component.html',
})
export class DeviceListPanelComponent {
  public readonly isLoading: InputSignal<boolean> = input<boolean>(false);
  public readonly haveInitialData: InputSignal<boolean> = input.required();
  public readonly nrOfDevices: InputSignal<number | null> = input.required();
}
