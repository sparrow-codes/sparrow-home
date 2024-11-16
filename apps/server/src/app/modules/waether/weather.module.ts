import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { SetupModule } from '../setup/setup.module';
import { UserModule } from '../user/user.module';
import { WeatherController } from './controllers/weather.controller';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [SetupModule, HttpModule, AuthModule, UserModule, ApiModule],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService],
})
export class WeatherModule {}
