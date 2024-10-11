import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GetLowestTemperatureResponse } from '~api/weather/models/get-lowest-temperature.response';

enum WeatherUrl {
  LOWEST_TEMPERATURE = 'weather/lowest-temperature',
}

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private readonly _http: HttpClient = inject(HttpClient);

  public getLowestTemperatureByNight(): Observable<number | undefined> {
    return this._http
      .get<GetLowestTemperatureResponse>(WeatherUrl.LOWEST_TEMPERATURE)
      .pipe(map((response) => response.temperature));
  }
}
