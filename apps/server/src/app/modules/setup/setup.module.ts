import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudModule } from '../cloud/cloud.module';
import { User } from '../user/enitities/user';
import { SetupController } from './controlers/setup.controller';
import { Setup } from './enitites/setup';
import { ModeService } from './services/mode/mode.service';
import { SetupService } from './services/setup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setup, User]), CloudModule],
  providers: [SetupService, ModeService],
  controllers: [SetupController],
  exports: [SetupService],
})
export class SetupModule {}
