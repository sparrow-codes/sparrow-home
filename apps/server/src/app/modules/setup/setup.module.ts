import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/enitities/user';
import { SetupController } from './controlers/setup.controller';
import { Setup } from './enitites/setup';
import { SetupService } from './services/setup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setup, User])],
  providers: [SetupService],
  controllers: [SetupController],
  exports: [SetupService],
})
export class SetupModule {}
