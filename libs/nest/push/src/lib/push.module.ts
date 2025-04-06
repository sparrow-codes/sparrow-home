import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { PushSubscriptionsClient } from '@sparrow-server/entities';

import { PushNotificationController } from './controller/push-notification.controller';
import { PushNotificationService } from './service';

@Module({
  controllers: [PushNotificationController],
  imports: [AuthModule, TypeOrmModule.forFeature([PushSubscriptionsClient])],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushModule {}
