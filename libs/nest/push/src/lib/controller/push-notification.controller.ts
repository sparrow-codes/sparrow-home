import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';
import { PushSubscription } from 'web-push';

import { PushNotificationService } from '../service';

@UseGuards(AuthGuard)
@ApiTags('Push Notification')
@Controller('push-notification')
export class PushNotificationController {
  public constructor(private readonly _pushNotificationService: PushNotificationService) {}

  @ApiOperation({ operationId: 'addSubscription' })
  @Post('add-subscription')
  public addSubscription(@Body() subscription: PushSubscription): void {
    this._pushNotificationService.addSubscription(subscription);
  }
}
