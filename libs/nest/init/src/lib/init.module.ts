import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@sparrow-server/entities';

import { AppInitService } from './services/app-init.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AppInitService],
  exports: [AppInitService],
})
export class InitModule {}
