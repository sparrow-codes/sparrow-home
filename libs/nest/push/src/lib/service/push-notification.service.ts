import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { PushSubscription, RequestOptions, sendNotification } from 'web-push';

import { PushMessage } from '../models';

@Injectable()
export class PushNotificationService {
  private readonly _subscriptions: PushSubscription[] = [];

  public constructor(private readonly _configService: ConfigService) {}

  public addSubscription(subscription: PushSubscription): void {
    Logger.log('Adding subscription to push notifications');
    this._subscriptions.push(subscription);
  }

  public notify(message: PushMessage): void {
    const options: RequestOptions = this._prepareOptions();

    if (this._subscriptions.length === 0) {
      Logger.log('No subscription clients.');
    }

    this._subscriptions.forEach((subscription, index) => {
      sendNotification(subscription, JSON.stringify({ notification: message }), options).then(() =>
        Logger.log(`Notified ${index + 1} subscriber`)
      );
    });
  }

  private _prepareOptions(): RequestOptions {
    const webPushPrivateKey: string | undefined = this._configService.get(ConfigKey.PUSH_PRIVATE_KEY);
    const webPushPublicKey: string | undefined = this._configService.get(ConfigKey.PUSH_PUBLIC_KEY);

    if (!webPushPrivateKey || !webPushPublicKey) {
      throw Error('Missing configuration for Push Notification Service!');
    }

    return {
      vapidDetails: {
        privateKey: webPushPrivateKey,
        publicKey: webPushPublicKey,
        subject: 'Push Notification',
      },
    };
  }
}
