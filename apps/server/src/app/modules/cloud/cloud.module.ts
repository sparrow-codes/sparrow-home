import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ComfortCloudConnector } from './connectors/comfort-cloud-connector';
import { CloudController } from './controllers/cloud.controller';
import { CloudConnectionService } from './services/cloud-connection/cloud-connection.service';

@Module({
  imports: [HttpModule, AuthModule, UserModule, ApiModule, ScheduleModule.forRoot()],
  providers: [CloudConnectionService, ComfortCloudConnector],
  controllers: [CloudController],
  exports: [CloudConnectionService],
})
export class CloudModule {}
