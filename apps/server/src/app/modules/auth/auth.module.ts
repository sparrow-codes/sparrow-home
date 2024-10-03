import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ConfigKey } from '../../enums/config-key';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService, JwtModule],
  imports: [
    UserModule,
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
