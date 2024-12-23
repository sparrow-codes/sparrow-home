import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@sparrow-server/entities';
import { ConfigKey } from '@sparrow-server/shared';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService, JwtModule],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get(ConfigKey.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(ConfigKey.JWT_EXPIRATION),
        },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
