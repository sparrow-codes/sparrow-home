import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { PushSubscriptionClient, User } from '@sparrow-server/entities';

import { PushNotificationController } from './controller/push-notification.controller';
import { PushNotificationService } from './service';

@Module({
  controllers: [PushNotificationController],
  imports: [AuthModule, TypeOrmModule.forFeature([PushSubscriptionClient, User])],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushModule {}
