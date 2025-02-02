import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { HomeDevice } from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';

import { AlarmController } from './controller/alarm.controller';
import { AlarmService } from './services/alarm.service';

@Module({
  controllers: [AlarmController],
  imports: [TypeOrmModule.forFeature([HomeDevice]), ApiModule, AuthModule],
  providers: [AlarmService],
})
export class AlarmModule {}
