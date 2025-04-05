import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationApiService } from '@sparrow-home/api';
import { filter, first, switchMap } from 'rxjs';

import { DataFacadeService } from './data-facade.service';

@Injectable({
  providedIn: 'root',
})
export class MobilePushNotificationService {
  private readonly _swPush: SwPush = inject(SwPush);
  private readonly _rootDataService: DataFacadeService = inject(DataFacadeService);
  private readonly _pushNotificationApiService: PushNotificationApiService = inject(PushNotificationApiService);
  private readonly _httpService: HttpClient = inject(HttpClient);
  private readonly _subscribed: WritableSignal<boolean> = signal(false);

  public constructor() {
    const webPushPublicKey: string | undefined = this._rootDataService.applicationConfig()?.webPushPublicKey;

    if (webPushPublicKey && !this._subscribed()) {
      this._swPush.requestSubscription({ serverPublicKey: webPushPublicKey });
    }
  }

  public subscribeToNotifications(): void {
    this._swPush.subscription
      .pipe(
        filter((subscription) => !!subscription),
        first(),
        switchMap((subscription) =>
          this._httpService.post(
            `${this._pushNotificationApiService.rootUrl}/api/push-notification/add-subscription`,
            subscription,
            {
              headers: { 'ngsw-bypass': 'true' },
            }
          )
        )
      )
      .subscribe();
  }

  public subscribeMessage(): void {
    this._swPush.messages.subscribe((res: object) => {
      console.log('Received push notification', res);
    });
  }
}
