import { Injectable, Logger } from '@nestjs/common';
import { first, from, map, Observable, of, switchMap } from 'rxjs';

import { SetupService } from '../../setup/services/setup.service';
import { GetWeatherResponse } from '../api/model/get-weather-response';
import { WeatherApiService } from '../api/weather-api.service';

@Injectable()
export class WeatherService {
  public constructor(
    private readonly weatherApiService: WeatherApiService,
    private readonly setupService: SetupService
  ) {}

  public getLowestTemperatureOverNight(): Observable<{ temperature?: number }> {
    const today: Date = new Date();
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return from(this.setupService.getSetup()).pipe(
      first(),
      switchMap((setup) => {
        const lat: number | undefined = setup.lat;
        const lng: number | undefined = setup.lng;

        if (lat && lng) {
          return this.weatherApiService.getWeather(lat, lng, today, tomorrow).pipe(map(this.getLowestTemperature));
        }

        return of({});
      })
    );
  }

  public getSunriseAndSunsetWithLowestTemperature(): Observable<{
    sunrise?: Date;
    sunset?: Date;
    lowestTemperature?: number;
  }> {
    const today: Date = new Date();
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return from(this.setupService.getSetup()).pipe(
      first(),
      switchMap((setup) => {
        const lat: number | undefined = setup.lat;
        const lng: number | undefined = setup.lng;

        if (lat && lng) {
          return this.weatherApiService.getWeather(lat, lng, today, tomorrow).pipe(
            map((response) => {
              return {
                sunset: new Date(response.daily.sunset[0]),
                sunrise: new Date(response.daily.sunrise[1]),
                lowestTemperature: this.getLowestTemperature(response),
              } as {
                sunrise?: Date;
                sunset?: Date;
                lowestTemperature?: number;
              };
            })
          );
        }
        Logger.warn('Missing or invalid configuration');
        return of({});
      })
    );
  }

  private getLowestTemperature(response: GetWeatherResponse): { temperature?: number } {
    const sunset: Date = new Date(response.daily.sunset[0]);
    const sunrise: Date = new Date(response.daily.sunrise[1]);

    const hoursAtNightIndexes: number[] = response.hourly.time.reduce((acc, current, index) => {
      const currentDate: Date = new Date(current);
      if (currentDate > sunset && currentDate < sunrise) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    const filteredTemperatures: number[] = response.hourly.temperature_2m.filter((_temp, index) =>
      hoursAtNightIndexes.includes(index)
    );

    return {
      temperature: Math.min(...filteredTemperatures),
    };
  }
}
