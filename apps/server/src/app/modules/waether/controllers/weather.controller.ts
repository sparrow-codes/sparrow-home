import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { WeatherService } from '../services/weather.service';
import { GetLowestTemperatureResponse } from './model/get-lowest-temperature.response';

@UseGuards(AuthGuard)
@Controller('weather')
export class WeatherController {
  public constructor(private readonly weatherService: WeatherService) {}

  @Get('/lowest-temperature')
  public getLowestTemperatureAtNight(): Observable<GetLowestTemperatureResponse> {
    return this.weatherService.getLowestTemperatureOverNight();
  }
}
