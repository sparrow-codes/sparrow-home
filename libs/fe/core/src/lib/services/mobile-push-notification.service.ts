import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationApiService } from '@sparrow-home/api';
import { first } from 'rxjs';

import { DataFacadeService } from './data-facade.service';

@Injectable({
  providedIn: 'root',
})
export class MobilePushNotificationService {
  private readonly _swPush: SwPush = inject(SwPush);
  private readonly _rootDataService: DataFacadeService = inject(DataFacadeService);
  private readonly _pushNotificationApiService: PushNotificationApiService = inject(PushNotificationApiService);
  private readonly _subscribed: WritableSignal<boolean> = signal(false);

  public subscribeToNotifications(): void {
    const webPushPublicKey: string | undefined = this._rootDataService.applicationConfig()?.webPushPublicKey;

    if (webPushPublicKey && !this._subscribed()) {
      this._swPush.requestSubscription({ serverPublicKey: webPushPublicKey }).then((pushNotification) => {
        this._pushNotificationApiService
          .addSubscription({ body: pushNotification })
          .pipe(first())
          .subscribe(() => this._subscribed.set(true));
      });
    }
  }

  public subscribeMessage(): void {
    this._swPush.messages.subscribe((res: object) => {
      console.log('Received push notification', res);
    });
  }
}
