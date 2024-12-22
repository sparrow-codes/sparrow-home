import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { CloudModule } from '@sparrow-server/cloud';
import { ApiModule } from '@sparrow-server/external-api';
import { InitModule } from '@sparrow-server/init';
import { SetupModule } from '@sparrow-server/setup';
import { ConfigKey } from '@sparrow-server/shared';
import { UserModule } from '@sparrow-server/user';

@Module({
  imports: [
    CloudModule,
    HttpModule,
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
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    SetupModule,
    ApiModule,
    InitModule,
  ],
})
export class AppModule {}
