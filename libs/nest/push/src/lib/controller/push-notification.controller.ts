import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from '@sparrow-server/auth';
import { User } from '@sparrow-server/entities';
import { Request } from 'express';

import { PushNotificationService } from '../service';
import { PushSubscriptionRequest } from './model/push-subscription-request';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Push Notification')
@Controller('push-notification')
export class PushNotificationController {
  public constructor(
    private readonly _pushNotificationService: PushNotificationService,
    private readonly _authService: AuthService
  ) {}

  @ApiOperation({ operationId: 'addSubscription' })
  @Post('add-subscription')
  public async addSubscription(@Req() request: Request, @Body() body: PushSubscriptionRequest): Promise<void> {
    const user: User = await this._authService.getUserFromToken(
      this._authService.extractTokenFromHeader(request.headers['authorization'] ?? '') ?? ''
    );

    await this._pushNotificationService.addSubscription(body, user);
  }
}
