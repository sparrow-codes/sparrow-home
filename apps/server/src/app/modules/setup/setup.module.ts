import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setup } from '../../entities/setup';
import { User } from '../../entities/user';
import { CloudModule } from '../cloud/cloud.module';
import { UserModule } from '../user/user.module';
import { SetupController } from './controlers/setup.controller';
import { SetupService } from './services/setup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setup, User]), CloudModule, UserModule],
  providers: [SetupService],
  controllers: [SetupController],
  exports: [SetupService],
})
export class SetupModule {}
