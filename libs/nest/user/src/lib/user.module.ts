import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { AlarmPreferences, AquaPreferences, CloudPreferences, Setup, User } from '@sparrow-server/entities';

import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Setup, CloudPreferences, AquaPreferences, AlarmPreferences]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
