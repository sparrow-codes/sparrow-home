import { Module } from '@nestjs/common';
import { AuthModule } from '@sparrow-server/auth';

import { PushNotificationController } from './controller/push-notification.controller';
import { PushNotificationService } from './service';

@Module({
  controllers: [PushNotificationController],
  imports: [AuthModule],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushModule {}
