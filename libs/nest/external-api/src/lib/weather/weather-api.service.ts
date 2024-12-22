import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { map, Observable } from 'rxjs';

import { GetSunriseSunsetResponse } from '../model/get-sunrise-sunset-response';
import { GetWeatherResponse } from '../model/get-weather-response';

@Injectable()
export class WeatherApiService {
  public constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

  public getNextSunriseAndSunset(
    lat: number,
    lng: number,
    startDate: Date,
    endDate: Date
  ): Observable<GetSunriseSunsetResponse> {
    return this._getWeather(lat, lng, startDate, endDate).pipe(
      map((response) => ({
        sunrise: new Date(response.daily.sunrise[1]),
        sunset: new Date(response.daily.sunset[0]),
      }))
    );
  }

  private _getWeather(lat: number, lng: number, startDate: Date, endDate: Date): Observable<GetWeatherResponse> {
    return this.http
      .get<GetWeatherResponse>(this.configService.get(ConfigKey.WEATHER_API_URL) ?? '', {
        params: {
          latitude: lat,
          longitude: lng,
          hourly: 'temperature_2m',
          daily: ['sunrise', 'sunset'],
          timezone: 'Europe/Berlin',
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
        },
      })
      .pipe(map((response) => response.data));
  }
}
