import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PushSubscriptionsClient } from '@sparrow-server/entities';
import { ConfigKey } from '@sparrow-server/shared';
import { Repository } from 'typeorm';
import { PushSubscription, RequestOptions, sendNotification } from 'web-push';

import { PushMessage } from '../models';

@Injectable()
export class PushNotificationService {
  public constructor(
    @InjectRepository(PushSubscriptionsClient)
    private readonly _pushSubscriptionsClientRepository: Repository<PushSubscriptionsClient>,
    private readonly _configService: ConfigService
  ) {}

  public async addSubscription(subscription: PushSubscription): Promise<void> {
    const existingSubscription: PushSubscriptionsClient | null =
      await this._pushSubscriptionsClientRepository.findOneBy({ auth: subscription.keys.auth });

    if (existingSubscription) {
      Logger.log('Subscription already exists');
      return;
    }

    Logger.log(`Adding subscription to push notifications`);

    const client: PushSubscriptionsClient = new PushSubscriptionsClient();
    client.endpoint = subscription.endpoint;
    client.p256dh = subscription.keys.p256dh;
    client.auth = subscription.keys.auth;
    await this._pushSubscriptionsClientRepository.save(client);
  }

  public async notify(message: PushMessage): Promise<void> {
    const options: RequestOptions = this._prepareOptions();
    const subscriptions: PushSubscriptionsClient[] = await this._pushSubscriptionsClientRepository.find();

    if (subscriptions.length === 0) {
      Logger.log('No subscription clients.');
    }

    Logger.log(`Number of clients: ${subscriptions.length}`);

    subscriptions.forEach((subscription, index) => {
      sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh,
          },
        },
        JSON.stringify({ notification: message }),
        options
      ).then(() => Logger.log(`Notified ${index + 1} subscriber`));
    });
  }

  private _prepareOptions(): RequestOptions {
    const webPushPrivateKey: string | undefined = this._configService.get(ConfigKey.PUSH_PRIVATE_KEY);
    const webPushPublicKey: string | undefined = this._configService.get(ConfigKey.PUSH_PUBLIC_KEY);
    const pushAdminEmail: string | undefined = this._configService.get(ConfigKey.PUSH_ADMIN_EMAIL);

    if (!webPushPrivateKey || !webPushPublicKey || !pushAdminEmail) {
      throw Error('Missing configuration for Push Notification Service!');
    }

    return {
      vapidDetails: {
        privateKey: webPushPrivateKey,
        publicKey: webPushPublicKey,
        subject: `mailto:${pushAdminEmail}`,
      },
    };
  }
}
