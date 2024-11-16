import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WeatherApiService } from './weather/weather-api.service';

@Module({
    imports: [HttpModule],
    providers: [WeatherApiService],
    exports: [WeatherApiService]
})
export class ApiModule {}
