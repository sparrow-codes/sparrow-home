import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setup } from '../setup/enitites/setup';
import { UserController } from './controller/user.controller';
import { User } from './enitities/user';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Setup])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
