import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PushSubscriptionClient, User } from '@sparrow-server/entities';
import { ConfigKey } from '@sparrow-server/shared';
import { Repository } from 'typeorm';
import { PushSubscription, RequestOptions, sendNotification } from 'web-push';

import { PushMessage } from '../models';

@Injectable()
export class PushNotificationService {
  public constructor(
    @InjectRepository(PushSubscriptionClient)
    private readonly _pushSubscriptionsClientRepository: Repository<PushSubscriptionClient>,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _configService: ConfigService
  ) {}

  public async addSubscription(subscription: PushSubscription, user: User): Promise<void> {
    const client: PushSubscriptionClient = user.pushSubscriptionClient ?? new PushSubscriptionClient();
    client.endpoint = subscription.endpoint;
    client.p256dh = subscription.keys.p256dh;
    client.auth = subscription.keys.auth;
    await this._pushSubscriptionsClientRepository.save(client);
    user.pushSubscriptionClient = client;
    await this._userRepository.save(user);
  }

  public async notify(message: PushMessage): Promise<void> {
    const options: RequestOptions = this._prepareOptions();
    const users: User[] = await this._userRepository.findBy({ isActive: true });
    const subscriptions: PushSubscriptionClient[] = users
      .filter((user) => user.pushSubscriptionClient !== null)
      .map((user) => user.pushSubscriptionClient as PushSubscriptionClient);

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
