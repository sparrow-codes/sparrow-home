import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { AlarmPreferences, HomeDevice, User } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';
import { PushModule } from '@sparrow-server/push';

import { AlarmController } from './controller/alarm.controller';
import { AlarmService } from './services/alarm.service';

@Module({
  controllers: [AlarmController],
  imports: [TypeOrmModule.forFeature([HomeDevice, AlarmPreferences, User]), ApiModule, AuthModule, PushModule],
  providers: [AlarmService],
})
export class AlarmModule {}
