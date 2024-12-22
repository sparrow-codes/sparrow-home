export interface GetWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
}

export interface DailyUnits {
  time: string;
  sunrise: string;
  sunset: string;
}

export interface Daily {
  time: string[];
  sunrise: string[];
  sunset: string[];
}
