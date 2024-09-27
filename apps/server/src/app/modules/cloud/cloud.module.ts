import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ComfortCloudConnector } from './connectors/comfort-cloud-connector';
import { CloudController } from './controllers/cloud.controller';
import { CloudConnectionService } from './services/cloud-connection/cloud-connection.service';

@Module({
  imports: [HttpModule],
  providers: [CloudConnectionService, ComfortCloudConnector],
  controllers: [CloudController],
})
export class CloudModule {}
