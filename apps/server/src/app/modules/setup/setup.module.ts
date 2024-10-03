import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { SetupController } from './controlers/setup.controller';
import { SetupService } from './services/setup.service';

@Module({
  imports: [UserModule],
  providers: [SetupService],
  controllers: [SetupController],
})
export class SetupModule {}
