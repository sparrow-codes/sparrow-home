export interface GetCurrentSetupResponse {
  currentMode: number;
  lat: number;
  lng: number;
  marginTemperatureOverNight: number;
  dictionaries: {
    modeDictionary: { value: number; label: string }[];
  };
}
