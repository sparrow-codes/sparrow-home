import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@sparrow-server/auth';
import { Setup, User } from '@sparrow-server/entities';

import { SetupController } from './controlers/setup.controller';
import { SetupService } from './services/setup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setup, User]), AuthModule],
  providers: [SetupService],
  controllers: [SetupController],
})
export class SetupModule {}
