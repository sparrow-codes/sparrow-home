import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmModule } from '@sparrow-server/alarm';
import { AuthModule } from '@sparrow-server/auth';
import { AutomationModule } from '@sparrow-server/automation';
import { HomeDeviceModule } from '@sparrow-server/device';
import {
  ActionJob,
  DeviceLastState,
  HomeDevice,
  PushSubscriptionClient,
  Setup,
  Task,
  User,
} from '@sparrow-server/entities';
import { ApiModule } from '@sparrow-server/external-api';
import { PushModule } from '@sparrow-server/push';
import { SetupModule } from '@sparrow-server/setup';
import { ConfigKey } from '@sparrow-server/shared';
import { UserModule } from '@sparrow-server/user';

import { CreateSetupTable1735995550693 } from '../db/migrations/1735995550693-CreateSetupTable';
import { CreateHomeDeviceTable1735995890303 } from '../db/migrations/1735995890303-CreateHomeDeviceTable';
import { CreateUserTable1735999040434 } from '../db/migrations/1735999040434-CreateUserTable';
import { CreatePushSubscription1744656092803 } from '../db/migrations/1744656092803-CreatePushSubscription';
import { CreateTaskTable1690000000000 } from '../db/migrations/1754335949380-CreateTaskTable';
import { CreateActionJobTable1762532633640 } from '../db/migrations/1762532633640-CreateActionJobTable';
import { CreateDeviceLastState1768117412317 } from '../db/migrations/1768117412317-CreateDeviceLastState';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(ConfigKey.DB_HOST),
        port: +configService?.get<number>(ConfigKey.DB_PORT),
        username: configService?.get<string>(ConfigKey.DB_USER_NAME),
        database: configService.get<string>(ConfigKey.DB_NAME),
        password: configService?.get<string>(ConfigKey.DB_PASSWORD),
        migrationsRun: true,
        entities: [User, HomeDevice, Setup, PushSubscriptionClient, Task, ActionJob, DeviceLastState],
        migrations: [
          CreateSetupTable1735995550693,
          CreateHomeDeviceTable1735995890303,
          CreateUserTable1735999040434,
          CreatePushSubscription1744656092803,
          CreateTaskTable1690000000000,
          CreateActionJobTable1762532633640,
          CreateDeviceLastState1768117412317,
        ],
      }),
    }),
    UserModule,
    AuthModule,
    SetupModule,
    ApiModule,
    HomeDeviceModule,
    AlarmModule,
    PushModule,
    AutomationModule,
  ],
})
export class AppModule {}
