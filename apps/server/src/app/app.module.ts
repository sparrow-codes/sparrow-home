import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigKey } from './enums/config-key';
import { CloudModule } from './modules/cloud/cloud.module';
import { DeviceModule } from './modules/device/device.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    CloudModule,
    HttpModule,
    DeviceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(ConfigKey.DB_HOST),
        port: +configService?.get<number>(ConfigKey.DB_PORT),
        username: configService?.get<string>(ConfigKey.DB_USER_NAME),
        password: configService?.get<string>(ConfigKey.DB_PASSWORD),
        schema: configService?.get<string>(ConfigKey.DB_SCHEMA),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
