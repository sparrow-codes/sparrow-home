import { Module } from '@nestjs/common';
import { CloudConnectionService } from './services/cloud-connection/cloud-connection.service';
import { CloudController } from './controllers/cloud.controller';
import { HttpModule } from '@nestjs/axios';
import { ComfortCloudConnector } from './connectors/comfort-cloud-connector';

@Module({
  imports: [HttpModule],
  providers: [CloudConnectionService, ComfortCloudConnector],
  controllers: [CloudController],
})
export class CloudModule {}
