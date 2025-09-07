import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmModule } from '@sparrow-server/alarm';
import { AuthModule } from '@sparrow-server/auth';
import { AutomationModule } from '@sparrow-server/automation';
import { HomeDeviceModule } from '@sparrow-server/device';
import { ApiModule } from '@sparrow-server/external-api';
import { PushModule } from '@sparrow-server/push';
import { SetupModule } from '@sparrow-server/setup';
import { ConfigKey } from '@sparrow-server/shared';
import { UserModule } from '@sparrow-server/user';

import { CreateSetupTable1735995550693 } from '../db/migrations/1735995550693-CreateSetupTable';
import { CreateHomeDeviceTable1735995890303 } from '../db/migrations/1735995890303-CreateHomeDeviceTable';
import { CreateCloudPreferencesTable1735996227082 } from '../db/migrations/1735996227082-CreateCloudPreferencesTable';
import { CreateAquaPreferencesTable1735998874554 } from '../db/migrations/1735998874554-CreateAquaPreferencesTable';
import { CreateUserTable1735999040434 } from '../db/migrations/1735999040434-CreateUserTable';
import { AlterHomeDevice1738173688939 } from '../db/migrations/1738173688939-AlterHomeDevice';
import { AlterHomeDeviceForOpenDoorSensor1738349248890 } from '../db/migrations/1738349248890-alterHomeDeviceForOpenDoorSensor';
import { AlterCloudPreferences1738866928125 } from '../db/migrations/1738866928125-AlterCloudPreferences';
import { AlterHomeDevice1742753620205 } from '../db/migrations/1742753620205-AlterHomeDevice';
import { CreateAlarmPreferences1743010222859 } from '../db/migrations/1743010222859-CreateAlarmPreferences';
import { AlterUserTable1744444867595 } from '../db/migrations/1744444867595-AlterUserTable';
import { CreatePushSubscription1744656092803 } from '../db/migrations/1744656092803-CreatePushSubscription';
import { CreateTaskTable1690000000000 } from '../db/migrations/1754335949380-CreateTaskTable';
import { AddTaskRelationToHomeDevice1690000000001 } from '../db/migrations/1754368602595-AddTaskRelationHomeDevice';

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
        schema: configService?.get<string>(ConfigKey.DB_SCHEMA),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [
          CreateSetupTable1735995550693,
          CreateHomeDeviceTable1735995890303,
          CreateCloudPreferencesTable1735996227082,
          CreateAquaPreferencesTable1735998874554,
          CreateUserTable1735999040434,
          AlterHomeDevice1738173688939,
          AlterHomeDeviceForOpenDoorSensor1738349248890,
          AlterCloudPreferences1738866928125,
          AlterHomeDevice1742753620205,
          CreateAlarmPreferences1743010222859,
          AlterUserTable1744444867595,
          CreatePushSubscription1744656092803,
          CreateTaskTable1690000000000,
          AddTaskRelationToHomeDevice1690000000001,
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
