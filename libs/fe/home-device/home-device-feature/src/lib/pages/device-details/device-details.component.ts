import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, inject, input, InputSignal, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonToggle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { bootstrapInfoCircle, bootstrapPencil, bootstrapTrash, bootstrapXCircleFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DeviceFacadeService } from '@sparrow-home/home-device-domain';
import {
  BatteryStatusComponent,
  ConfirmationDialogComponent,
  DeviceActionComponent,
  DeviceTypeComponent,
  Divider,
  PageTitleComponent,
  ResponsiveSelectInterfaceDirective,
} from '@sparrow-home/ui';
import { DeviceType, HomeDevice, humanize, HumanizePipe } from '@sparrow-home/utils';
import { Observable } from 'rxjs';

import { EditDeviceDialog } from '../../components/edit-device-dialog/edit-device-dialog';
import { SignalStrengthComponent } from '../../components/signal-strength/signal-strength.component';

@Component({
  selector: 'sp-device-device-details',
  imports: [
    CommonModule,
    PageTitleComponent,
    DeviceTypeComponent,
    SignalStrengthComponent,
    FormsModule,
    DeviceActionComponent,
    TranslatePipe,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    HumanizePipe,
    IonLabel,
    IonToggle,
    IonSelect,
    IonSelectOption,
    ResponsiveSelectInterfaceDirective,
    IonButtons,
    TranslatePipe,
    Divider,
    BatteryStatusComponent,
    NgIcon,
    IonSkeletonText,
    IonProgressBar,
  ],
  providers: [provideIcons({ bootstrapInfoCircle, bootstrapPencil, bootstrapTrash, bootstrapXCircleFill })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './device-details.component.html',
})
export class DeviceDetailsComponent implements OnInit {
  public readonly id: InputSignal<string | null> = input<string | null>(null);

  private readonly _facadeService: DeviceFacadeService = inject(DeviceFacadeService);
  private readonly _translateService: TranslateService = inject(TranslateService);
  private readonly _modalController: ModalController = inject(ModalController);

  protected readonly isLoading$: Observable<boolean> = this._facadeService.isLoading$;
  protected readonly isRefreshing$: Observable<boolean> = this._facadeService.isRefreshing$;
  protected readonly deviceDetails: Signal<HomeDevice | null> = this._facadeService.homeDeviceDetails;
  protected readonly params: Signal<[string, string][]> = computed(() =>
    Object.entries(this.deviceDetails()?.params ?? {})
  );
  protected readonly deviceType: typeof DeviceType = DeviceType;
  protected readonly mainActionKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainActionKey ?? null);
  protected readonly mainParamKey: Signal<string | null> = computed(() => this.deviceDetails()?.mainParamKey ?? null);
  protected readonly isOnMainPage: Signal<boolean> = computed(() => this.deviceDetails()?.isOnMainPage ?? false);
  protected readonly mainActions: Signal<{ value: string; label: string }[]> = computed(
    () =>
      this.deviceDetails()
        ?.actions?.filter(
          (action) => action.type === 'boolean' || (action.type === 'enum' && action.enumValues.length === 1)
        )
        .map((action) => ({ value: action.key, label: humanize(action.key) })) ?? []
  );

  protected readonly mainParams: Signal<{ value: string; label: string }[]> = computed(
    () => this.params()?.map(([value]) => ({ value: value, label: humanize(value) })) ?? []
  );

  public ngOnInit(): void {
    if (this.id()) {
      this._facadeService.fetchDeviceDetailsById(Number(this.id()));
    }
  }

  protected async onDeviceDelete(id: number, name: string): Promise<void> {
    const modal: HTMLIonModalElement = await this._modalController.create({
      component: ConfirmationDialogComponent,

      componentProps: {
        content: this._translateService.instant('home.remove_device_confirmation_content', { deviceName: name }),
      },
    });

    await modal.present();

    await modal.onDidDismiss().then((result) => {
      if (result.data) {
        this._facadeService.deleteDevice(id);
      }

      modal.remove();
    });
  }

  protected async onDeviceNameChange(id: number, value: string): Promise<void> {
    const modal: HTMLIonModalElement = await this._modalController.create({
      component: EditDeviceDialog,
      cssClass: '.small-modal',
      componentProps: {
        deviceName: value,
      },
    });

    await modal.present();

    await modal.onDidDismiss().then((result) => {
      if (result.data) {
        this._facadeService.changeDeviceName(id, result.data);
      }

      modal.remove();
    });
  }

  protected publishZigbeeEvent(deviceId: string, payload: Record<string, unknown>): void {
    this._facadeService.publishZigbeeEvent(deviceId, payload);
  }

  protected setMainAction(actionKey: string | null): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: actionKey,
      mainParamKey: this.mainParamKey(),
      isOnMainPage: this.isOnMainPage(),
    });
  }

  protected setMainParam(paramKey: string | null): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: this.mainActionKey(),
      mainParamKey: paramKey,
      isOnMainPage: this.isOnMainPage(),
    });
  }

  protected setIsOnMainPage(isOnMainPage: boolean): void {
    this._facadeService.updateDeviceSettings(this.id() as string, {
      mainActionKey: this.mainActionKey(),
      mainParamKey: this.mainParamKey(),
      isOnMainPage: isOnMainPage,
    });
  }
}
